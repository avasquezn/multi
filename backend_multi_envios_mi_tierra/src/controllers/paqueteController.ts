import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const insertPaquete = async (req: Request, res: Response): Promise<Response> => {
    const { paquetes } = req.body; // `paquetes` es un arreglo de objetos JSON

    if (!paquetes || !Array.isArray(paquetes) || paquetes.length === 0) {
        console.error('Validación fallida: "paquetes" no está presente o no es un arreglo.');
        return res.status(400).json({
            message: 'El campo "paquetes" es requerido y debe ser un arreglo de objetos.',
            success: false
        });
    }

    try {
        // Ajustar el valor de `fec_entrega` para que sea 'null' si es null
        const paquetesAdjusted = paquetes.map((paquete) => ({
            ...paquete,
            fec_entrega: paquete.fec_entrega === null ? 'null' : paquete.fec_entrega,
        }));

        const paquetesJson = JSON.stringify(paquetesAdjusted); // Convertir el arreglo ajustado a formato JSON

        const result = await sequelize.query(
            'CALL INS_MULTIPAQUETE(:p_datos_paquetes);',
            {
                replacements: {
                    p_datos_paquetes: paquetesJson
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Paquetes creados exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al crear los paquetes:', error); // Log para el error completo
        return res.status(500).json({
            message: 'Ocurrió un error al crear los paquetes.',
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

export const getEnviosPorCliente = async (req: Request, res: Response): Promise<Response> => {
    const { codCliente } = req.params;

    try {
        const envios = await sequelize.query(
            'CALL GET_ENVIOS_POR_CLIENTE(:p_fk_cod_cliente);',
            {
                replacements: {
                    p_fk_cod_cliente: codCliente
                },
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).json({
            envios: envios[0],
            success: true
        });

    } catch (error: any) {
        console.error('Error al obtener los envíos del cliente:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al obtener los envíos del cliente.',
            error: error.original?.sqlMessage || error.message,
            success: false
        });
    }
};

export const updatePaqueteEstado = async (req: Request, res: Response): Promise<Response> => {
    const { cod_paquete, estado, fec_entrega, usr_modifico } = req.body;

    if (!cod_paquete) {
        return res.status(400).json({
            message: 'El código de paquete es requerido',
            success: false
        });
    }

    try {
        const result = await sequelize.query(
            'CALL UPD_PAQUETE_ESTADO(:p_cod_paquete, :p_estado, :p_fec_entrega, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_paquete: cod_paquete,
                    p_estado: estado,
                    p_fec_entrega: fec_entrega,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Paquete actualizado exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al actualizar el paquete:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el paquete',
            error: errorMessage,
            success: false
        });
    }
};

export const updatePaquetesEstadoMasivo = async (req: Request, res: Response): Promise<Response> => {
    const { usr_modifico, paquetes } = req.body;

    if (!paquetes || !Array.isArray(paquetes) || paquetes.length === 0) {
        return res.status(400).json({
            message: 'El campo "paquetes" es requerido y debe ser un arreglo de objetos.',
            success: false
        });
    }

    if (!usr_modifico) {
        return res.status(400).json({
            message: 'El campo "usr_modifico" es requerido.',
            success: false
        });
    }

    try {
        // Convertir el arreglo de paquetes a JSON
        const paquetesJson = JSON.stringify(paquetes);

        const result = await sequelize.query(
            'CALL UPD_PAQUETES_ESTADO_MASIVO_JSON(:p_usr_modifico, :p_paquetes);',
            {
                replacements: {
                    p_usr_modifico: usr_modifico,
                    p_paquetes: paquetesJson
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Paquetes actualizados exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al actualizar los paquetes masivamente:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar los paquetes masivamente.',
            error: errorMessage,
            success: false
        });
    }
};
