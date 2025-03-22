import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Obtener ganancias por día, mes y año
export const getEarningsByDayMonthYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado
        const earnings = await sequelize.query('CALL SP_GET_GANANCIAS_POR_DIA_MES_ANIO()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Ganancias obtenidas correctamente.',
            data: earnings,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener las ganancias:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener las ganancias.',
            error: errorMessage,
            success: false,
        });
    }
};

export const getEarningsByMonthYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado
        const earnings = await sequelize.query('CALL SP_GET_GANANCIAS_POR_MES_ANIO()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Ganancias obtenidas correctamente.',
            data: earnings,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener las ganancias:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener las ganancias.',
            error: errorMessage,
            success: false,
        });
    }
};

export const getEarningsByYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado
        const earnings = await sequelize.query('CALL SP_GET_GANANCIAS_POR_ANIO()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Ganancias obtenidas correctamente.',
            data: earnings,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener las ganancias:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener las ganancias.',
            error: errorMessage,
            success: false,
        });
    }
};

export const getLast6Clients = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado
        const clients = await sequelize.query('CALL GET_ULTIMOS_6_CLIENTES()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Últimos 6 clientes obtenidos correctamente.',
            data: clients,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener los últimos 6 clientes:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener los últimos 6 clientes.',
            error: errorMessage,
            success: false,
        });
    }
};

export const getCajasConInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado
        const cajas = await sequelize.query('CALL GET_CAJAS_CON_INFO()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Cajas obtenidas correctamente.',
            data: cajas,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener las cajas:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener las cajas.',
            error: errorMessage,
            success: false,
        });
    }
};

export const getDepositos = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Llamar al procedimiento almacenado GET_DEPOSITOS
        const depositos = await sequelize.query('CALL GET_DEPOSITOS()', {
            type: QueryTypes.RAW,
        });

        // Devolver el resultado
        return res.status(200).json({
            message: 'Depósitos obtenidos correctamente.',
            data: depositos,
            success: true,
        });
    } catch (error: any) {
        // Capturar y manejar errores
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al obtener los depósitos:', error);

        return res.status(500).json({
            message: 'Ocurrió un error al obtener los depósitos.',
            error: errorMessage,
            success: false,
        });
    }
};
