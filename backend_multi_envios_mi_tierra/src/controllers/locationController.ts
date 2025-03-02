import { Request, Response } from 'express';
import sequelize from '../config/database/index';
import { QueryTypes } from 'sequelize';

// Controlador para insertar un país
export const insertarPais = async (req: Request, res: Response): Promise<Response> => {
  const { p_nom_pais, p_num_zona, p_usr_creo } = req.body;

  try {
    // Llamar al procedimiento almacenado
    const result = await sequelize.query(
      'CALL INS_PAIS(:p_nom_pais, :p_num_zona, :p_usr_creo);',
      {
        replacements: {
          p_nom_pais,
          p_num_zona,
          p_usr_creo
        },
        type: QueryTypes.RAW
      }
    );

    // Retornar respuesta con mensaje de éxito
    return res.status(200).json({
      message: (result as any)[0]?.Mensaje || 'País creado exitosamente',
      codigoPais: (result as any)[0]?.CodigoPais, // Si el SP devuelve un código del país
      success: true
    });

  } catch (error: any) {
    const errorMessage = error.original?.sqlMessage || error.message;
    console.error('Error al insertar país:', error);

    // Retornar respuesta de error
    return res.status(500).json({
      message: 'Ocurrió un error al insertar el país.',
      error: errorMessage,
      success: false
    });
  }
};

export const insertarDepartamento = async (req: Request, res: Response): Promise<Response> => {
  const { p_fk_cod_pais, p_nom_departamento, p_usr_creo } = req.body;

  try {
    // Llamar al procedimiento almacenado
    const result = await sequelize.query(
      'CALL INS_DEPARTAMENTO(:p_fk_cod_pais, :p_nom_departamento, :p_usr_creo);',
      {
        replacements: {
          p_fk_cod_pais,
          p_nom_departamento,
          p_usr_creo,
        },
        type: QueryTypes.RAW,
      }
    );

    // Retornar respuesta con mensaje de éxito
    return res.status(200).json({
      message: (result as any)[0]?.Mensaje || 'Departamento creado exitosamente',
      success: true,
    });
  } catch (error: any) {
    const errorMessage = error.original?.sqlMessage || error.message;
    console.error('Error al insertar departamento:', error);

    // Retornar respuesta de error
    return res.status(500).json({
      message: 'Ocurrió un error al insertar el departamento.',
      error: errorMessage,
      success: false,
    });
  }
};

export const insertarMunicipio = async (req: Request, res: Response): Promise<Response> => {
  const { p_fk_cod_departamento, p_nom_municipio, p_id_postal, p_usr_creo } = req.body;

  try {
    // Llamar al procedimiento almacenado
    const result = await sequelize.query(
      'CALL INS_MUNICIPIO(:p_fk_cod_departamento, :p_nom_municipio, :p_id_postal, :p_usr_creo);',
      {
        replacements: {
          p_fk_cod_departamento,
          p_nom_municipio,
          p_id_postal,
          p_usr_creo,
        },
        type: QueryTypes.RAW,
      }
    );

    // Retornar respuesta con mensaje de éxito
    return res.status(200).json({
      message: (result as any)[0]?.Mensaje || 'Municipio creado exitosamente',
      success: true,
    });
  } catch (error: any) {
    const errorMessage = error.original?.sqlMessage || error.message;
    console.error('Error al insertar municipio:', error);

    // Retornar respuesta de error
    return res.status(500).json({
      message: 'Ocurrió un error al insertar el municipio.',
      error: errorMessage,
      success: false,
    });
  }
};

// Controlador para obtener todos los países
export const getAllCountries = async (req: Request, res: Response) => {
  try {
      const countries = await sequelize.query('CALL GET_ALL_COUNTRIES()', {
          type: QueryTypes.RAW,
      });
      res.json(countries); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener todos los países:', error);
      res.status(500).json({ error: 'Error al obtener todos los países' });
  }
};

// Controlador para obtener países con departamentos
export const getCountriesWithDepartments = async (req: Request, res: Response) => {
  const { cod_pais } = req.query; // Obtener el código del país del query string

  if (!cod_pais) {
      return res.status(400).json({ error: 'Se requiere el código del país' });
  }

  try {
      const departments = await sequelize.query('CALL GET_COUNTRIES_WITH_DEPARTMENTS(:cod_pais)', {
          replacements: { cod_pais: parseInt(cod_pais as string, 10) },
          type: QueryTypes.RAW,
      });
      res.json(departments); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener países con departamentos:', error);
      res.status(500).json({ error: 'Error al obtener países con departamentos' });
  }
};

// Controlador para obtener ciudades de un país y departamento específicos
export const getCitiesByCountryAndDepartment = async (req: Request, res: Response) => {
  const { cod_pais, cod_departamento } = req.query; // Obtener el código del país y del departamento del query string

  if (!cod_pais || !cod_departamento) {
      return res.status(400).json({ error: 'Se requieren el código del país y del departamento' });
  }

  try {
      const cities = await sequelize.query(
          'CALL GET_CITIES_BY_COUNTRY_AND_DEPARTMENT(:cod_pais, :cod_departamento)',
          {
              replacements: {
                  cod_pais: parseInt(cod_pais as string, 10),
                  cod_departamento: parseInt(cod_departamento as string, 10),
              },
              type: QueryTypes.RAW,
          }
      );
      res.json(cities); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener ciudades por país y departamento:', error);
      res.status(500).json({ error: 'Error al obtener ciudades por país y departamento' });
  }
};

export const getCitiesByDepartment = async (req: Request, res: Response) => {
  const { cod_departamento } = req.query; // Obtener el código del país y del departamento del query string

  if (!cod_departamento) {
      return res.status(400).json({ error: 'Se requieren el código del departamento' });
  }

  try {
      const cities = await sequelize.query(
          'CALL GET_CITIES_BY_DEPARTMENT(:cod_departamento)',
          {
              replacements: {
                  cod_departamento: parseInt(cod_departamento as string, 10),
              },
              type: QueryTypes.RAW,
          }
      );
      res.json(cities); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener ciudades por país y departamento:', error);
      res.status(500).json({ error: 'Error al obtener ciudades por país y departamento' });
  }
};

export const getAllCountries_1 = async (req: Request, res: Response) => {
  try {
      const countries = await sequelize.query('CALL GET_CONTRIES_1()', {
          type: QueryTypes.RAW,
      });
      res.json(countries); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener todos los países:', error);
      res.status(500).json({ error: 'Error al obtener todos los países' });
  }
};

export const getAllDeparments_1 = async (req: Request, res: Response) => {
  const { cod_pais } = req.query; // Obtener el código del país del query string

  if (!cod_pais) {
      return res.status(400).json({ error: 'Se requiere el código del país' });
  }

  try {
      const departments = await sequelize.query('CALL GET_COUNTRIES_WITH_DEPARTMENTS(:cod_pais)', {
          replacements: { cod_pais: parseInt(cod_pais as string, 10) },
          type: QueryTypes.RAW,
      });
      res.json(departments); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener países con departamentos:', error);
      res.status(500).json({ error: 'Error al obtener países con departamentos' });
  }
};

export const getAllMunicipios_1 = async (req: Request, res: Response) => {
  const { cod_departamento } = req.query; // Obtener el código del país y del departamento del query string

  if (!cod_departamento) {
      return res.status(400).json({ error: 'Se requieren el código del departamento' });
  }

  try {
      const cities = await sequelize.query(
          'CALL GET_CITIES_BY_DEPARTMENT(:cod_departamento)',
          {
              replacements: {
                  cod_departamento: parseInt(cod_departamento as string, 10),
              },
              type: QueryTypes.RAW,
          }
      );
      res.json(cities); // Devuelve los resultados del primer conjunto
  } catch (error) {
      console.error('Error al obtener ciudades por país y departamento:', error);
      res.status(500).json({ error: 'Error al obtener ciudades por país y departamento' });
  }
};

export const getPaisesConDetalles = async (req: Request, res: Response) => {
  try {
    const paisesConDetalles = await sequelize.query('CALL GET_PAISES_CON_DETALLES()', {
      type: QueryTypes.RAW,
    });

    // Sequelize typically returns an array of results when calling a stored procedure
    // You might need to access the first element depending on your database driver
    res.json(paisesConDetalles); 
  } catch (error) {
    console.error('Error al obtener países con detalles:', error);
    res.status(500).json({ 
      error: 'Error al obtener los detalles de países, departamentos y municipios',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};