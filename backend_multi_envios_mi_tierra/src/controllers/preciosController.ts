import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Obtener precios por país
export const getPricesByCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const prices = await sequelize.query('CALL GET_PRECIOS_POR_PAIS()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(prices);
    } catch (error) {
        console.error('Error al obtener los precios:', error);
        return res.status(500).json({ error: 'Error al obtener los precios' });
    }
};

// Insertar un nuevo precio
export const insertPrice = async (req: Request, res: Response): Promise<Response> => {
    const { fkCodPais, precio, usrCreo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_PRECIO(:p_fkCodPais, :p_precio, :p_usrCreo);',
            {
                replacements: {
                    p_fkCodPais: fkCodPais,
                    p_precio: precio,
                    p_usrCreo: usrCreo,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Precio insertado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('Ya existe un precio para este país')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al insertar el precio:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el precio.',
            error: errorMessage,
            success: false,
        });
    }
};

// Actualizar un precio existente
export const updatePrice = async (req: Request, res: Response): Promise<Response> => {
    const { codPais, codPrecio, nuevoPrecio, usrModifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_PRECIO(:p_codPais, :p_codPrecio, :p_nuevoPrecio, :p_usrModifico);',
            {
                replacements: {
                    p_codPais: codPais,
                    p_codPrecio: codPrecio,
                    p_nuevoPrecio: nuevoPrecio,
                    p_usrModifico: usrModifico,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Precio actualizado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('No existe un precio para este país y código especificado')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al actualizar el precio:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el precio.',
            error: errorMessage,
            success: false,
        });
    }
};
