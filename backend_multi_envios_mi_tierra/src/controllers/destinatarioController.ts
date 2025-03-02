import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

/**
 * Insertar un destinatario.
 */
export const insertDestinatario = async (req: Request, res: Response): Promise<Response> => {
    const {
        id_persona,
        nom_persona,
        fk_cod_genero,
        fk_cod_pais,
        fk_cod_departamento,
        fk_cod_municipio,
        telefono,
        correo,
        direccion,
        fk_cod_cliente,
        usr_creo
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_DESTINATARIO(:p_id_persona, :p_nom_persona, :p_fk_cod_genero, ' +
            ':p_fk_cod_pais, :p_fk_cod_departamento, :p_fk_cod_municipio, ' +
            ':p_telefono, :p_correo, :p_direccion, :p_fk_cod_cliente, :p_usr_creo);',
            {
                replacements: {
                    p_id_persona: id_persona,
                    p_nom_persona: nom_persona,
                    p_fk_cod_genero: fk_cod_genero,
                    p_fk_cod_pais: fk_cod_pais,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_telefono: telefono,
                    p_correo: correo,
                    p_direccion: direccion,
                    p_fk_cod_cliente: fk_cod_cliente,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Destinatario creado exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        // Manejar errores específicos
        if (errorMessage.includes('Duplicate entry')) {
            if (errorMessage.includes('TELEFONO')) {
                return res.status(400).json({
                    message: 'El número de teléfono ya está registrado',
                    success: false
                });
            }
            if (errorMessage.includes('CORREO')) {
                return res.status(400).json({
                    message: 'El correo electrónico ya está registrado',
                    success: false
                });
            }
            if (errorMessage.includes('ID_PERSONA')) {
                return res.status(400).json({
                    message: 'El ID de persona ya está registrado',
                    success: false
                });
            }
        }

        console.error('Error al crear el destinatario:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al crear el destinatario.',
            error: errorMessage,
            success: false
        });
    }
};

/**
 * Obtener los destinatarios de un cliente específico.
 */
export const getDestinatariosPorCliente = async (req: Request, res: Response): Promise<Response> => {
    const { cod_cliente } = req.params; // Obtener el parámetro desde la URL

    try {
        const destinatarios = await sequelize.query(
            'CALL GET_DESTINATARIOS_POR_CLIENTE(:p_cod_cliente);',
            {
                replacements: { p_cod_cliente: cod_cliente },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            data: destinatarios,
            success: true
        });
    } catch (error) {
        console.error('Error al obtener los destinatarios:', error);
        return res.status(500).json({
            message: 'Error al obtener los destinatarios del cliente',
            success: false,
            error: error
        });
    }
};
