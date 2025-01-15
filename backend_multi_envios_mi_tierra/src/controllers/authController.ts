import { Request, Response } from 'express';
import { Usuario } from '../models/tblMsUsuarios';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Environment variables for JWT secrets
const JWTSECRET = process.env.JWTSECRET || 'default_jwt_secret';
const JWTREFRESHSECRET = process.env.JWTREFRESHSECRET || 'default_refresh_secret';

interface IPayload {
  cod_usuario: number;
  nom_usuario: string;
  rol: string;
  permisos: any[];
}

interface IPersonaInfo {
  NOM_PERSONA: string;
  TELEFONO: string;
  CORREO: string;
}

async function getPersonaInfo(usuarioId: number): Promise<IPersonaInfo | null> {
  const persona: any[] = await sequelize.query(
    'CALL GET_PERSONA_INFO_FOR_USER(:usuarioId);',
    { 
      replacements: { usuarioId },
      type: QueryTypes.SELECT
    }
  );
  
  return persona.length > 0 && persona[0]['0'] ? persona[0]['0'] as IPersonaInfo : null;
}

async function getRolPermisos(usuarioId: number): Promise<any[]> {
  return await sequelize.query(
    `CALL GET_ROL_OBJETOS_PERMISOS_FOR_USER(${usuarioId});`,
    { type: QueryTypes.RAW }
  );
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { nom_usuario, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { NOM_USUARIO: nom_usuario } });

    if (!usuario || usuario.CONTRASENA !== contrasena) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const [results, personaInfo] = await Promise.all([
      getRolPermisos(usuario.COD_USUARIO),
      getPersonaInfo(usuario.COD_USUARIO)
    ]);

    if (!personaInfo) {
      return res.status(404).json({ message: 'No se encontró información de la persona' });
    }

    const payload: IPayload = {
      cod_usuario: usuario.COD_USUARIO,
      nom_usuario: usuario.NOM_USUARIO,
      rol: results[0].roleName,
      permisos: results
    };

    const token = jwt.sign(payload, JWTSECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ cod_usuario: usuario.COD_USUARIO }, JWTREFRESHSECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      refreshToken,
      usuario: {
        cod_usuario: usuario.COD_USUARIO,
        nombre: personaInfo.NOM_PERSONA,
        nom_usuario: usuario.NOM_USUARIO,
        telefono: personaInfo.TELEFONO,
        correo: personaInfo.CORREO,
        rol: results[0].roleName,
        permisos: results
      }
    });

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWTSECRET) as IPayload;
    const usuario = await Usuario.findByPk(decoded.cod_usuario);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const [results, personaInfo] = await Promise.all([
      getRolPermisos(usuario.COD_USUARIO),
      getPersonaInfo(usuario.COD_USUARIO)
    ]);

    if (!personaInfo) {
      return res.status(404).json({ message: 'No se encontró información de la persona' });
    }

    return res.status(200).json({
      usuario: {
        cod_usuario: usuario.COD_USUARIO,
        nombre: personaInfo.NOM_PERSONA,
        nom_usuario: usuario.NOM_USUARIO,
        telefono: personaInfo.TELEFONO,
        correo: personaInfo.CORREO,
        rol: results[0].roleName,
        permisos: results
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    console.error('Error al obtener datos del usuario:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<Response> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token es requerido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWTREFRESHSECRET) as { cod_usuario: number };
    const usuario = await Usuario.findByPk(decoded.cod_usuario);

    if (!usuario) {
      return res.status(403).json({ message: 'Usuario no encontrado' });
    }

    const results = await getRolPermisos(usuario.COD_USUARIO);

    const payload: IPayload = {
      cod_usuario: usuario.COD_USUARIO,
      nom_usuario: usuario.NOM_USUARIO,
      rol: results[0].roleName,
      permisos: results
    };

    const newToken = jwt.sign(payload, JWTSECRET, { expiresIn: '1h' });
    return res.status(200).json({ token: newToken });

  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}