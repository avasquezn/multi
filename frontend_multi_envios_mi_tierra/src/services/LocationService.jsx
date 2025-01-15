import api from '../utils/Fetch';

// Servicio para insertar un nuevo país
export const insertPais = async (data) => {
    try {
        const response = await api.post('/location/insertar-pais', {
            p_nom_pais: data.p_nom_pais,
            p_num_zona: data.p_num_zona,
            p_usr_creo: data.p_usr_creo,
        });
        return response.data;
    } catch (error) {
        console.error('Error al insertar país:', error);
        throw error;
    }
};

export const insertDepartamento = async (data) => {
    try {
        const response = await api.post('/location/insertar-departamento', {
            p_fk_cod_pais: data.p_fk_cod_pais,
            p_nom_departamento: data.p_nom_departamento,
            p_usr_creo: data.p_usr_creo,
        });
        return response.data;
    } catch (error) {
        console.error('Error al insertar departamento:', error);
        throw error;
    }
};

export const insertMunicipio = async (data) => {
    try {
        const response = await api.post('/location/insertar-municipio', {
            p_fk_cod_departamento: data.p_fk_cod_departamento,
            p_nom_municipio: data.p_nom_municipio,
            p_id_postal: data.p_id_postal,
            p_usr_creo: data.p_usr_creo,
        });
        return response.data;
    } catch (error) {
        console.error('Error al insertar municipio:', error);
        throw error;
    }
};

// Servicio para obtener todos los países
export const getAllCountries = async () => {
    try {
        const response = await api.get('/location/countries');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todos los países:', error);
        throw error;
    }
};

// Servicio para obtener países con sus departamentos
export const getCountriesWithDepartments = async (cod_pais) => {
    try {
        const response = await api.get('/location/departments', {
            params: { cod_pais }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo países con departamentos:', error);
        throw error;
    }
};

// Servicio para obtener ciudades por país y departamento
export const getCitiesByCountryAndDepartment = async (cod_pais, cod_departamento) => {
    try {
        const response = await api.get('/location/cities', {
            params: { cod_pais, cod_departamento }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo ciudades por país y departamento:', error);
        throw error;
    }
};

export const getCitiesByDepartment = async (cod_departamento) => {
    try {
        const response = await api.get('/location/citiesByDeparment', {
            params: { cod_departamento }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo ciudades por país y departamento:', error);
        throw error;
    }
};

export const getAllCountries_1 = async () => {
    try {
        const response = await api.get('/location/countries_1');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo todos los países:', error);
        throw error;
    }
};

export const getAllDepartments_1 = async (cod_pais) => {
    try {
        const response = await api.get('/location/departments_1', {
            params: { cod_pais }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo países con departamentos:', error);
        throw error;
    }
};

export const getAllMunicipios_1 = async (cod_departamento) => {
    try {
        const response = await api.get('/location/cities_1', {
            params: { cod_departamento }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo ciudades por país y departamento:', error);
        throw error;
    }
};

export const getPaisesConDetalles = async () => {
    try {
        const response = await api.get('/location/countries-details');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo detalles de países, departamentos y municipios:', error);
        throw error;
    }
};