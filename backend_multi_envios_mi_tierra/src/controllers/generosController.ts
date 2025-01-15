import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const getGeneros = async (req: Request, res: Response): Promise<Response> => {
    try {
        const generos = await sequelize.query('CALL GET_GENEROS()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(generos);
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        return res.status(500).json({ error: 'Error al obtener los géneros' });
    }
};

export const getGeneros_1 = async (req: Request, res: Response): Promise<Response> => {
    try {
        const generos = await sequelize.query('CALL GET_GENEROS_1()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(generos);
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        return res.status(500).json({ error: 'Error al obtener los géneros' });
    }
};

export const insertGenero = async (req: Request, res: Response): Promise<Response> => {
    const { genero, usr_creo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_GENERO(:p_genero, :p_usr_creo);',
            {
                replacements: {
                    p_genero: genero,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Género insertado correctamente.',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('El género ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        console.error('Error al insertar el género:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el género.',
            error: errorMessage,
            success: false
        });
    }
};

export const updateGeneroStatus = async (req: Request, res: Response): Promise<Response> => {
    const { COD_GENERO, ESTADO, USR_MODIFICO } = req.body;

    try {
        const result = await sequelize.query(
            `CALL UPD_GENERO_ESTADO(:COD_GENERO, :ESTADO, :USR_MODIFICO);`,
            {
                replacements: {
                    COD_GENERO,
                    ESTADO,
                    USR_MODIFICO
                },
                type: QueryTypes.RAW
            }
        );

        const message = (result as any)[0]?.mensaje;

        return res.status(200).json({ message });
    } catch (error) {
        console.error('Error al actualizar el estado del género:', error);
        return res.status(500).json({ message: 'Error al actualizar el estado del género.' });
    }
};

export const updateGenero = async (req: Request, res: Response): Promise<Response> => {
    const { cod_genero, genero, usr_modifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_GENERO(:p_cod_genero, :p_genero, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_genero: cod_genero,
                    p_genero: genero,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        const mensaje = (result as any)[0]?.mensaje || 'Género actualizado correctamente.';
        const success = (result as any)[0]?.success || true;

        return res.status(200).json({
            message: mensaje,
            success: success
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('El género ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false
            });
        }

        console.error('Error al actualizar el género:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el género.',
            error: errorMessage,
            success: false
        });
    }
};
