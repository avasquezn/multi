import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

export const insertDatosEnvio = async (req: Request, res: Response): Promise<Response> => {
    const {
        fk_cod_cliente,
        cantidad_cajas,
        fk_cod_pais_origen,
        fk_cod_pais_destino,
        fk_cod_departamento,
        fk_cod_municipio,
        fk_cod_direccion,
        fk_cod_persona,
        num_envio,
        usr_creo
    } = req.body;

    try {
        const result = await sequelize.query(
            'CALL INS_DATOS_ENVIO(:p_fk_cod_cliente, :p_cantidad_cajas, :p_fk_cod_pais_origen, ' +
            ':p_fk_cod_pais_destino, :p_fk_cod_departamento, :p_fk_cod_municipio, ' +
            ':p_fk_cod_direccion, :p_fk_cod_persona, :p_num_envio, :p_usr_creo);',
            {
                replacements: {
                    p_fk_cod_cliente: fk_cod_cliente,
                    p_cantidad_cajas: cantidad_cajas,
                    p_fk_cod_pais_origen: fk_cod_pais_origen,
                    p_fk_cod_pais_destino: fk_cod_pais_destino,
                    p_fk_cod_departamento: fk_cod_departamento,
                    p_fk_cod_municipio: fk_cod_municipio,
                    p_fk_cod_direccion: fk_cod_direccion,
                    p_fk_cod_persona: fk_cod_persona,
                    p_num_envio: num_envio,
                    p_usr_creo: usr_creo
                },
                type: QueryTypes.RAW
            }
        );

        return res.status(200).json({
            message: (result as any)[0]?.Mensaje || 'Datos de envío creados exitosamente',
            success: true
        });

    } catch (error: any) {
        const errorMessage = error.original?.sqlMessage || error.message;
        console.error('Error al crear los datos de envío:', error);
        return res.status(500).json({
            message: 'Ocurrió un error al crear los datos de envío.',
            error: errorMessage,
            success: false
        });
    }
};

export const getDatosEnvio = async (req: Request, res: Response): Promise<Response> => {
    try {
        const datosEnvio = await sequelize.query('CALL GET_DATOS_ENVIO();', {
            type: QueryTypes.RAW
        });

        // Devuelve directamente datosEnvio, al igual que en getUsers
        return res.status(200).json(datosEnvio);
    } catch (error: any) {
        console.error('Error al obtener los datos de envío:', error);
        return res.status(500).json({ error: error.original?.sqlMessage || error.message });
    }
};
