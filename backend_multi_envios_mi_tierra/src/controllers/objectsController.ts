import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const getObjetos = async (req: Request, res: Response) => {
    try {
        const objetos = await sequelize.query('CALL GET_OBJETOS()', {
            type: QueryTypes.RAW,
        });
        
        // Devuelve los resultados
        return res.status(200).json(objetos);
    } catch (error) {
        console.error('Error al obtener los objetos:', error);
        return res.status(500).json({ error: 'Error al obtener los objetos' });
    }
};

export const insertObjeto = async (req: Request, res: Response): Promise<Response> => {
    const { nom_objeto, des_objeto, usr_creo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_OBJETO(:p_nom_objeto, :p_des_objeto, :p_usr_creo);',
            {
                replacements: {
                    p_nom_objeto: nom_objeto,
                    p_des_objeto: des_objeto,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Objeto insertado correctamente.',
            success: true
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;
        
        // Verificar si es el error de objeto duplicado
        if (errorMessage.includes('El nombre del objeto ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el objeto.',
            error: errorMessage,
            success: false
        });
    }
};

export const updateObjectStatus = async (req: Request, res: Response): Promise<void> => {
    const { COD_OBJETO, ESTADO, USR_MODIFICO } = req.body;

    try {
        // Ejecutar el procedimiento almacenado
        const result = await sequelize.query(
            `CALL UPD_OBJETO_ESTADO(:COD_OBJETO, :ESTADO, :USR_MODIFICO)`,
            {
                replacements: {
                    COD_OBJETO,
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
            res.status(500).json({ message: 'No se pudo actualizar el estado del objeto.' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del objeto:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del objeto.' });
    }
};

export const updateObject = async (req: Request, res: Response): Promise<Response> => {
    const { cod_objeto, nom_objeto, des_objeto, usr_modifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_OBJETO(:p_cod_objeto, :p_nom_objeto, :p_des_objeto, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_objeto: cod_objeto,
                    p_nom_objeto: nom_objeto,
                    p_des_objeto: des_objeto,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        // Obtener el mensaje del resultado
        const mensaje = (result as any)[0]?.mensaje || 'Objeto actualizado correctamente.';
        const success = (result as any)[0]?.success || true;

        return res.status(200).json({
            message: mensaje,
            success: success
        });

    } catch (error: any) {
        // Capturar el mensaje específico del error
        const errorMessage = error.original?.sqlMessage || error.message;

        // Verificar si es el error de nombre duplicado
        if (errorMessage.includes('El nombre del objeto ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        // Para otros errores
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el objeto.',
            error: errorMessage,
            success: false
        });
    }
};