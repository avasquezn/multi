import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Controlador para obtener todos los roles
export const getPermisos = async (req: Request, res: Response) => {
    try {
        const roles = await sequelize.query('CALL GET_PERMISOS()', {
            type: QueryTypes.RAW,
        });
        
        // Devuelve los resultados
        return res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener los permisos:', error);
        return res.status(500).json({ error: 'Error al obtener los permisos' });
    }
};

export const insertPermission = async (req: Request, res: Response): Promise<Response> => {
    const { fk_cod_rol, fk_cod_objeto, permiso_inserccion, permiso_eliminacion, permiso_actualizacion, permiso_consultar, permiso_reporte, usr_creo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_PERMISO(:p_fk_cod_rol, :p_fk_cod_objeto, :p_permiso_inserccion, :p_permiso_eliminacion, :p_permiso_actualizacion, :p_permiso_consultar, :p_permiso_reporte, :p_usr_creo);',
            {
                replacements: {
                    p_fk_cod_rol: fk_cod_rol,
                    p_fk_cod_objeto: fk_cod_objeto,
                    p_permiso_inserccion: permiso_inserccion,
                    p_permiso_eliminacion: permiso_eliminacion,
                    p_permiso_actualizacion: permiso_actualizacion,
                    p_permiso_consultar: permiso_consultar,
                    p_permiso_reporte: permiso_reporte,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Permiso insertado correctamente.',
            success: true
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;

        // Verificar si es el error de permiso duplicado
        if (errorMessage.includes('El permiso para este rol y objeto ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el permiso.',
            error: errorMessage,
            success: false
        });
    }
};

export const updatePermisoStatus = async (req: Request, res: Response): Promise<void> => {
    const { COD_PERMISO, ESTADO, USR_MODIFICO } = req.body;

    try {
        // Ejecutar el procedimiento almacenado
        const result = await sequelize.query(
            `CALL UPD_PERMISO_ESTADO(:COD_PERMISO, :ESTADO, :USR_MODIFICO)`,
            {
                replacements: {
                    COD_PERMISO,
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
            res.status(500).json({ message: 'No se pudo actualizar el estado del permiso.' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del permiso:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del permiso.' });
    }
};

export const updatePermission = async (req: Request, res: Response): Promise<Response> => {
    const { cod_permiso, permiso_inserccion, permiso_eliminacion, permiso_actualizacion, permiso_consultar, permiso_reporte, usr_modifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_PERMISO(:p_cod_permiso, :p_permiso_inserccion, :p_permiso_eliminacion, :p_permiso_actualizacion, :p_permiso_consultar, :p_permiso_reporte, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_permiso: cod_permiso,
                    p_permiso_inserccion: permiso_inserccion,
                    p_permiso_eliminacion: permiso_eliminacion,
                    p_permiso_actualizacion: permiso_actualizacion,
                    p_permiso_consultar: permiso_consultar,
                    p_permiso_reporte: permiso_reporte,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        // Obtener el mensaje del resultado
        const mensaje = (result as any)[0]?.mensaje || 'Permiso actualizado correctamente.';
        const success = (result as any)[0]?.success || true;

        return res.status(200).json({
            message: mensaje,
            success: success
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;

        // Verificar si es un error específico de permiso no encontrado
        if (errorMessage.includes('No existe un permiso con el COD_PERMISO especificado')) {
            return res.status(404).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el permiso.',
            error: errorMessage,
            success: false
        });
    }
};