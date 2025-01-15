import api from '../utils/Fetch';

// Obtener los paquetes
export const getPaquetes = async () => {
    try {
        const response = await api.get('/paquetes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los paquetes:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los paquetes');
    }
};

// Insertar un paquete
export const insertPaquete = async (paqueteData) => {
    try {
        const response = await api.post('/paquetes/insert-paquetes', paqueteData);
        return response.data?.message || 'Datos de paquete insertados correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar los datos del paquete';
        console.error('Error al insertar los datos del paquete:', errorMessage);
        throw new Error(errorMessage);
    }
};
