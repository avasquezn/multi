import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Obtener cajas con información del país y precio
export const getBoxesWithCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const boxes = await sequelize.query('CALL GET_CAJAS_CON_PAISES()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(boxes);
    } catch (error) {
        console.error('Error al obtener las cajas:', error);
        return res.status(500).json({ error: 'Error al obtener las cajas.' });
    }
};

// Insertar una nueva caja
export const insertBox = async (req: Request, res: Response): Promise<Response> => {
    const { fkCodPrecio, idCaja, detalle, usrCreo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_CAJA(:p_fkCodPrecio, :p_idCaja, :p_detalle, :p_usrCreo);',
            {
                replacements: {
                    p_fkCodPrecio: fkCodPrecio,
                    p_idCaja: idCaja,
                    p_detalle: detalle,
                    p_usrCreo: usrCreo,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Caja insertada correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('Ya existe una caja con el mismo código de precio y ID de caja')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al insertar la caja:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar la caja.',
            error: errorMessage,
            success: false,
        });
    }
};

// Actualizar una caja existente
export const updateBox = async (req: Request, res: Response): Promise<Response> => {
    const { codCaja, fkCodPrecio, idCaja, detalle, usrModifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_CAJA(:p_codCaja, :p_fkCodPrecio, :p_idCaja, :p_detalle, :p_usrModifico);',
            {
                replacements: {
                    p_codCaja: codCaja,
                    p_fkCodPrecio: fkCodPrecio,
                    p_idCaja: idCaja,
                    p_detalle: detalle,
                    p_usrModifico: usrModifico,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Caja actualizada correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('Ya existe otra caja con el mismo código de precio y ID de caja')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al actualizar la caja:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar la caja.',
            error: errorMessage,
            success: false,
        });
    }
};
