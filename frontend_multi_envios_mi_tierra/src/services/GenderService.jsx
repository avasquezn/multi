import api from '../utils/Fetch';

export const getGenders = async () => {
    try {
        const response = await api.get('/genders');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        throw error;
    }
};

export const getGenders_1 = async () => {
    try {
        const response = await api.get('/genders/status-1');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        throw error;
    }
};

export const insertGender = async (genreData) => {
    try {
        const response = await api.post('/genders/insert-gender', genreData);
        return response.data?.message || 'Género insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el género';
        console.error('Error al insertar el género:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateGenderStatus = async (genreData) => {
    try {
        const response = await api.post('/genders/update-status', genreData);
        return response.data.message || 'Estado del género actualizado correctamente';
    } catch (error) {
        console.error('Error al actualizar el estado del género:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el estado del género');
    }
};

export const updateGender = async (genreData) => {
    try {
        const response = await api.post('/genders/update-gender', genreData);
        return response.data?.message || 'Género actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el género';
        console.error('Error al actualizar el género:', errorMessage);
        throw new Error(errorMessage);
    }
};
