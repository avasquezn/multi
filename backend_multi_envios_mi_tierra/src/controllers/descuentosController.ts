import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const getTipoDescuento = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tiposDescuento = await sequelize.query('CALL GET_TIPO_DESCUENTO()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(tiposDescuento);
    } catch (error) {
        console.error('Error al obtener los tipos de descuento:', error);
        return res.status(500).json({ error: 'Error al obtener los tipos de descuento' });
    }
};

// Obtener todos los descuentos con el detalle y porcentaje del tipo de descuento
export const getDescuentos = async (req: Request, res: Response): Promise<Response> => {
    try {
        const descuentos = await sequelize.query('CALL GET_DESCUENTOS()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json(descuentos);
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
        return res.status(500).json({ error: 'Error al obtener los descuentos' });
    }
};

export const insertDiscountType = async (req: Request, res: Response): Promise<Response> => {
    const { detalle, esPorcentaje, usrCreo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_TIPO_DESCUENTO(:p_detalle, :p_es_porcentaje, :p_usr_creo);',
            {
                replacements: {
                    p_detalle: detalle,
                    p_es_porcentaje: esPorcentaje,
                    p_usr_creo: usrCreo,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Tipo de descuento insertado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('El tipo de descuento con el mismo detalle ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al insertar el tipo de descuento:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el tipo de descuento.',
            error: errorMessage,
            success: false,
        });
    }
};

// Insertar un nuevo descuento
export const insertDiscount = async (req: Request, res: Response): Promise<Response> => {
    const { fkCodTipoDescuento, nombre, cantidad, usrCreo } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_DESCUENTO(:p_fk_cod_tipo_descuento, :p_nombre, :p_cantidad, :p_usr_creo);',
            {
                replacements: {
                    p_fk_cod_tipo_descuento: fkCodTipoDescuento,
                    p_nombre: nombre,
                    p_cantidad: cantidad,
                    p_usr_creo: usrCreo,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Descuento insertado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('El nombre del descuento ya existe')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al insertar el descuento:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al insertar el descuento.',
            error: errorMessage,
            success: false,
        });
    }
};

// Actualizar un tipo de descuento existente
export const updateDiscountType = async (req: Request, res: Response): Promise<Response> => {
    const { codTipoDesc, detalle, esPorcentaje, usrModifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPDATE_TIPO_DESCUENTO(:p_cod_tipo_desc, :p_detalle, :p_es_porcentaje, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_tipo_desc: codTipoDesc,
                    p_detalle: detalle,
                    p_es_porcentaje: esPorcentaje,
                    p_usr_modifico: usrModifico,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Tipo de descuento actualizado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('No se encontró el tipo de descuento con el código proporcionado')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al actualizar el tipo de descuento:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el tipo de descuento.',
            error: errorMessage,
            success: false,
        });
    }
};

// Actualizar un descuento existente
export const updateDiscount = async (req: Request, res: Response): Promise<Response> => {
    const { codDesc, fkCodTipoDesc, nombre, cantidad, usrModifico } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPDATE_DESCUENTO(:p_cod_desc, :p_fk_cod_tipo_desc, :p_nombre, :p_cantidad, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_desc: codDesc,
                    p_fk_cod_tipo_desc: fkCodTipoDesc,
                    p_nombre: nombre,
                    p_cantidad: cantidad,
                    p_usr_modifico: usrModifico,
                },
                type: QueryTypes.RAW,
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.mensaje || 'Descuento actualizado correctamente.',
            success: true,
        });
    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        if (errorMessage.includes('No se encontró el descuento con el código proporcionado')) {
            return res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }

        console.error('Error al actualizar el descuento:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al actualizar el descuento.',
            error: errorMessage,
            success: false,
        });
    }
};
