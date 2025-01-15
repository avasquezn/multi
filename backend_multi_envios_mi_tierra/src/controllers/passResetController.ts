import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import { Correo } from '../models/tblCorreos';
import { Persona } from '../models/tblPersonas';
import { Usuario } from '../models/tblMsUsuarios';
import { transportResetPassword, transport } from '../email/index'; // Ajusta la ruta según sea necesario

// Definir la estructura del Correo con sus asociaciones
interface CorreoWithAssociations extends Correo {
  Persona?: PersonaWithAssociations;
}

// Definir la estructura de la Persona con sus asociaciones
interface PersonaWithAssociations extends Persona {
  Usuarios?: Usuario[];
}


export const passReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    // Verificar si el correo existe
    const emailRecord = await Correo.findOne({
      where: { CORREO: email },
      include: [
        {
          model: Persona,
          required: true,
          include: [
            {
              model: Usuario,
              required: true,
              attributes: ['COD_USUARIO', 'NOM_USUARIO']
            }
          ]
        }
      ]
    }) as unknown as CorreoWithAssociations | null;

    if (!emailRecord) {
      res.status(404).json({ message: 'Correo electrónico no encontrado' });
      return;
    }

    const persona = emailRecord.Persona;
    if (!persona || !persona.Usuarios || persona.Usuarios.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const cod_usuario = persona.Usuarios[0].COD_USUARIO;
    const nom_usuario = persona.Usuarios[0].NOM_USUARIO;
    const nombre = persona.NOM_PERSONA.split(' ')[0]; // Supone que el primer nombre es la primera parte de NOM_PERSONA

    // Generar token
    const token = jwt.sign({ cod_usuario, nom_usuario }, process.env.JWTSECRET!, { expiresIn: '1h' });

    // Configurar el correo
    const mailOptions = transportResetPassword(nombre, email, token);

    // Enviar correo
    await transport.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo enviado' });
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
  const { cod_usuario, nueva_contrasena, usr_modifico } = req.body;

  try {
      const result = await sequelize.query(
          'CALL UPD_CONTRASENA(:p_cod_usuario, :p_nueva_contrasena, :p_usr_modifico);',
          {
              replacements: {
                  p_cod_usuario: cod_usuario,
                  p_nueva_contrasena: nueva_contrasena,
                  p_usr_modifico: usr_modifico
              },
              type: QueryTypes.RAW
          }
      );

      // Obtener el mensaje del resultado
      const mensaje = (result as any)[0]?.mensaje || 'Contraseña actualizada correctamente.';
      const success = (result as any)[0]?.success || true;

      return res.status(200).json({
          message: mensaje,
          success: success
      });

  } catch (error: any) {
      // Capturar el mensaje específico del error
      const errorMessage = error.original?.sqlMessage || error.message;

      // Verificar si hay errores específicos que necesiten un manejo especial
      if (errorMessage.includes('Usuario no encontrado') || 
          errorMessage.includes('Contraseña inválida')) {
          return res.status(400).json({
              message: errorMessage,
              success: false
          });
      }

      // Para otros errores
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({
          message: 'Ocurrió un error al actualizar la contraseña.',
          error: errorMessage,
          success: false
      });
  }
};