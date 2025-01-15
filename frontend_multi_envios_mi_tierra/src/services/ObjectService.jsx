import api from '../utils/Fetch';

export const getObjects = async () => {
    try {
        const response = await api.get('/objects');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los objetos:', error);
        throw error;
    }
};

export const insertObject = async (objectData) => {
    try {
        const response = await api.post('/objects/insert-objects', objectData);
        return response.data?.message || 'Objecto insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el objeto';
        console.error('Error al insertar el objeto:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateObjectStatus = async (objectData) => {
    try {
        const response = await api.post('/objects/update-status', objectData);
        
        return response.data.message || 'Estado del objeto actualizado correctamente';
    } catch (error) {
        console.error('Error al actualizar el estado del objeto:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el estado del objeto');
    }
};

export const updateObject = async (objectData) => {
    try {
        const response = await api.post('/objects/update-object', objectData);
        return response.data?.message || 'Objeto actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el objeto';
        console.error('Error al actualizar el objeto:', errorMessage);
        throw new Error(errorMessage);
    }
};