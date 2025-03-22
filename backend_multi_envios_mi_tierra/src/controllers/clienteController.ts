import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const insertCliente = async (req: Request, res: Response): Promise<Response> => {
    const {
        // Datos de persona
        id_persona,
        nom_persona,
        fk_cod_genero,
        // Datos de ubicación
        fk_cod_pais,
        fk_cod_departamento,
        fk_cod_municipio,
        // Datos de contacto
        telefono1,
        telefono2,
        telefono3,
        correo,
        // Datos de dirección
        direccion,
        // Usuario que crea
        usr_creo
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_CLIENTE(:p_id_persona, :p_nom_persona, :p_fk_cod_genero, ' +
            ':p_fk_cod_pais, :p_fk_cod_departamento, :p_fk_cod_municipio, ' +
            ':p_telefono1, :p_telefono2, :p_telefono3, :p_correo, :p_direccion, :p_usr_creo);',
            {
                replacements: {
                    p_id_persona: id_persona,
                    p_nom_persona: nom_persona,
                    p_fk_cod_genero: fk_cod_genero,
                    p_fk_cod_pais: fk_cod_pais,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_telefono1: telefono1,
                    p_telefono2: telefono2, // puede enviarse vacío o null si no se ingresa
                    p_telefono3: telefono3, // puede enviarse vacío o null si no se ingresa
                    p_correo: correo,
                    p_direccion: direccion,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Persona y datos relacionados creados exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;

        // Manejar errores específicos por duplicidad
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

        console.error('Error al crear la persona y datos relacionados:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al crear la persona y sus datos relacionados.',
            error: errorMessage,
            success: false
        });
    }
};

export const getClientes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientes = await sequelize.query('CALL GET_CLIENTES()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json({
            data: clientes,
            success: true
        });
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return res.status(500).json({
            message: 'Error al obtener los clientes y sus datos relacionados',
            success: false,
            error: error
        });
    }
};

export const getClientesEnvio = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientes = await sequelize.query('CALL GET_CLIENTES_ENVIO()', {
            type: QueryTypes.RAW,
        });

        return res.status(200).json({
            data: clientes,
            success: true
        });
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return res.status(500).json({
            message: 'Error al obtener los clientes y sus datos relacionados',
            success: false,
            error: error
        });
    }
};

export const updateCliente = async (req: Request, res: Response): Promise<Response> => {
    const {
        cod_persona,
        id_persona,
        nom_persona,
        fk_cod_genero,
        fk_cod_pais,
        fk_cod_departamento,
        fk_cod_municipio,
        telefono,
        correo,
        direccion,
        usr_modifico
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL UPD_CLIENTE(:p_cod_persona, :p_id_persona, :p_nom_persona, :p_fk_cod_genero, ' +
            ':p_fk_cod_pais, :p_fk_cod_departamento, :p_fk_cod_municipio, ' +
            ':p_telefono, :p_correo, :p_direccion, :p_usr_modifico);',
            {
                replacements: {
                    p_cod_persona: cod_persona,
                    p_id_persona: id_persona,
                    p_nom_persona: nom_persona,
                    p_fk_cod_genero: fk_cod_genero,
                    p_fk_cod_pais: fk_cod_pais,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_telefono: telefono,
                    p_correo: correo,
                    p_direccion: direccion,
                    p_usr_modifico: usr_modifico
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Cliente actualizado correctamente',
            success: (result as any)[0]?.success || true
        });

    } catch (error: any) {
        console.error('Error al actualizar el cliente:', error);
        return res.status(500).json({
            message: 'Error al actualizar los datos del cliente',
            error: error.original?.sqlMessage || error.message,
            success: false
        });
    }
};