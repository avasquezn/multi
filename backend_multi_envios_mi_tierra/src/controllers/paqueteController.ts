import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const insertPaquete = async (req: Request, res: Response): Promise<Response> => {
    const {
        fk_cod_caja,
        fk_cod_cliente,
        fk_cod_envio,
        fec_entrega,
        usr_creo
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_PAQUETE(:p_fk_cod_caja, :p_fk_cod_cliente, :p_fk_cod_envio, :p_fec_entrega, :p_usr_creo);',
            {
                replacements: {
                    p_fk_cod_caja: fk_cod_caja,
                    p_fk_cod_cliente: fk_cod_cliente,
                    p_fk_cod_envio: fk_cod_envio,
                    p_fec_entrega: fec_entrega,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Paquete creado exitosamente',
            codigoPaquete: (result as any)[0]?.CodigoPaquete,
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al crear el paquete:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al crear el paquete.',
            error: errorMessage,
            success: false
        });
    }
};

export const getPaquetes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const paquetes = await sequelize.query('CALL GET_PAQUETES();', {
            type: QueryTypes.RAW
        });

        return res.status(200).json(paquetes);

    } catch (error: any) {
        console.error('Error al obtener los paquetes:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al obtener los paquetes.',
            error: error.original?.sqlMessage || error.message
        });
    }
};
