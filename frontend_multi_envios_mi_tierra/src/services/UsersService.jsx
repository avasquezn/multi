import api from '../utils/Fetch';

// Función para obtener todos los usuarios
export const getUsers = async () => {
    try {
        const response = await api.get('/users'); // Ajusta la ruta según tu configuración
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error; // Vuelve a lanzar el error para que pueda ser manejado en otros lugares
    }
};

// Función para insertar un usuario
export const insertUser = async (userData) => {
    try {
        const response = await api.post('/users/insert-user', userData);
        return response.data?.message || 'Usuario insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el usuario';
        console.error('Error al insertar el usuario:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Función para actualizar el estado de un usuario
export const updateUserStatus = async (userData) => {
    try {
        const response = await api.post('/users/update-status', userData);
        return response.data.message || 'Estado del usuario actualizado correctamente';
    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el estado del usuario');
    }
};

// Función para actualizar los datos de un usuario
export const updateUser = async (userData) => {
    try {
        const response = await api.post('/users/update-user', userData); // Cambia la ruta según tu API
        return response.data?.message || 'Usuario actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario';
        console.error('Error al actualizar el usuario:', errorMessage);
        throw new Error(errorMessage);
    }
};
