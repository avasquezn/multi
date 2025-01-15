import api from '../utils/Fetch';

export const getEnvios = async () => {
    try {
        const response = await api.get('/datos-envio');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los envíos:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los envíos');
    }
};

export const insertEnvio = async (envioData) => {
    try {
        const response = await api.post('/datos-envio/insert-datos-envio', envioData);
        return response.data?.message || 'Datos de envío insertados correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar los datos de envío';
        console.error('Error al insertar los datos de envío:', errorMessage);
        throw new Error(errorMessage);
    }
};
