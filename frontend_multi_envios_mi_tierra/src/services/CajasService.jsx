import api from '../utils/Fetch';

// Obtener cajas con información del país y precio
export const getBoxesWithCountry = async () => {
    try {
        const response = await api.get('/boxes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las cajas:', error);
        throw error;
    }
};

// Insertar una nueva caja
export const insertBox = async (boxData) => {
    try {
        const response = await api.post('/boxes/insert-box', boxData);
        return response.data?.message || 'Caja insertada correctamente.';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar la caja.';
        console.error('Error al insertar la caja:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Actualizar una caja existente
export const updateBox = async (boxData) => {
    try {
        const response = await api.post('/boxes/update-box', boxData);
        return response.data?.message || 'Caja actualizada correctamente.';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar la caja.';
        console.error('Error al actualizar la caja:', errorMessage);
        throw new Error(errorMessage);
    }
};
