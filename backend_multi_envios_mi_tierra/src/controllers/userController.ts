import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Controlador para obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await sequelize.query('CALL getUsers()', {
            type: QueryTypes.RAW,
        });
        
        // Devuelve los resultados
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const insertUser = async (req: Request, res: Response): Promise<Response> => {
    const {
        fk_cod_rol, id_persona, nom_persona, fk_cod_genero,
        fk_cod_pais, fk_cod_departamento, fk_cod_municipio,
        nom_usuario, contrasena, telefono, correo, usr_creo
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_USER(:p_fk_cod_rol, :p_id_persona, :p_nom_persona, :p_fk_cod_genero, :p_fk_cod_pais, :p_fk_cod_departamento, :p_fk_cod_municipio, :p_nom_usuario, :p_contrasena, :p_telefono, :p_correo, :p_usr_creo);',
            {
                replacements: {
                    p_fk_cod_rol: fk_cod_rol,
                    p_id_persona: id_persona,
                    p_nom_persona: nom_persona,
                    p_fk_cod_genero: fk_cod_genero,
                    p_fk_cod_pais: fk_cod_pais,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_nom_usuario: nom_usuario,
                    p_contrasena: contrasena,
                    p_telefono: telefono,
                    p_correo: correo,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Usuario insertado correctamente.',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        console.error('Error al insertar el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el usuario.',
            error: errorMessage,
            success: false
        });
    }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<Response> => {
    const { id_usuario, estado, usr_modifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_USER_ESTADO(:p_id_usuario, :p_estado, :p_usr_modifico);',
            {
                replacements: {
                    p_id_usuario: id_usuario,
                    p_estado: estado,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Estado del usuario actualizado correctamente.',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        console.error('Error al actualizar el estado del usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el estado del usuario.',
            error: errorMessage,
            success: false
        });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const {
        cod_usuario,
        nom_persona,
        id_persona,
        fk_cod_genero,
        fk_cod_pais,
        fk_cod_departamento,
        fk_cod_municipio,
        usr_modifico,
        telefono,
        fk_cod_rol
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_USER(:p_cod_usuario, :p_nom_persona, :p_id_persona, :p_fk_cod_genero, :p_fk_cod_pais, :p_fk_cod_departamento, :p_fk_cod_municipio, :p_usr_modifico, :p_telefono, :p_fk_cod_rol);',
            {
                replacements: {
                    p_cod_usuario: cod_usuario,
                    p_nom_persona: nom_persona,
                    p_id_persona: id_persona,
                    p_fk_cod_genero: fk_cod_genero,
                    p_fk_cod_pais: fk_cod_pais,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_usr_modifico: usr_modifico,
                    p_telefono: telefono,
                    p_fk_cod_rol: fk_cod_rol
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Usuario actualizado correctamente.',
            success: true
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        console.error('Error al actualizar el usuario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el usuario.',
            error: errorMessage,
            success: false
        });
    }
};