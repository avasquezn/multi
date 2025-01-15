import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Controlador para obtener todos los roles
export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await sequelize.query('CALL GET_ROLES()', {
            type: QueryTypes.RAW,
        });
        
        // Devuelve los resultados
        return res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return res.status(500).json({ error: 'Error al obtener roles' });
    }
};

export const getRoles_1 = async (req: Request, res: Response) => {
    try {
        const roles = await sequelize.query('CALL GET_ROLES_1()', {
            type: QueryTypes.RAW,
        });
        
        // Devuelve los resultados
        return res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return res.status(500).json({ error: 'Error al obtener roles' });
    }
};

export const insertRole = async (req: Request, res: Response): Promise<Response> => {
    const { nom_rol, des_rol, usr_creo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_ROL(:p_nom_rol, :p_des_rol, :p_usr_creo);',
            {
                replacements: {
                    p_nom_rol: nom_rol,
                    p_des_rol: des_rol,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Rol insertado correctamente.',
            success: true
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;
        
        // Verificar si es el error de rol duplicado
        if (errorMessage.includes('El nombre del rol ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el rol.',
            error: errorMessage,
            success: false
        });
    }
};

export const updateRoleStatus = async (req: Request, res: Response): Promise<void> => {
    const { COD_ROL, ESTADO, USR_MODIFICO } = req.body;

    try {
        // Ejecutar el procedimiento almacenado
        const result = await sequelize.query(
            `CALL UPD_ROL_ESTADO(:COD_ROL, :ESTADO, :USR_MODIFICO)`,
            {
                replacements: {
                    COD_ROL,
                    ESTADO,
                    USR_MODIFICO
                }
            }
        );

        // Usar casting para obtener el mensaje
        const message = (result as any)[0]?.mensaje;

        if (message) {
            res.status(200).json({ message });
        } else {
            res.status(500).json({ message: 'No se pudo actualizar el estado del rol.' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del rol:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del rol.' });
    }
};

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    const { cod_rol, nom_rol, des_rol, usr_modifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_ROL(:p_cod_rol, :p_nom_rol, :p_des_rol, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_rol: cod_rol,
                    p_nom_rol: nom_rol,
                    p_des_rol: des_rol,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        // Obtener el mensaje del resultado
        const mensaje = (result as any)[0]?.mensaje || 'Rol actualizado correctamente.';
        const success = (result as any)[0]?.success || true;

        return res.status(200).json({
            message: mensaje,
            success: success
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;

        // Verificar si es el error de rol duplicado
        if (errorMessage.includes('El nombre del rol ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el rol.',
            error: errorMessage,
            success: false
        });
    }
};