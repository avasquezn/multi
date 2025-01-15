import api from '../utils/Fetch';

export const getPrices = async () => {
    try {
        const response = await api.get('/prices');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los precios:', error);
        throw error;
    }
};

export const insertPrice = async (priceData) => {
    try {
        const response = await api.post('/prices/insert-price', priceData);
        return response.data?.message || 'Precio insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el precio';
        console.error('Error al insertar el precio:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updatePrice = async (priceData) => {
    try {
        const response = await api.post('/prices/update-price', priceData);
        return response.data?.message || 'Precio actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el precio';
        console.error('Error al actualizar el precio:', errorMessage);
        throw new Error(errorMessage);
    }
};
