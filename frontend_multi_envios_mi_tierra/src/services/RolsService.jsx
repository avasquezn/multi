import api from '../utils/Fetch';

// Función para obtener todos los roles
export const getRoles = async () => {
    try {
        const response = await api.get('/roles'); // Ajusta la ruta según tu configuración
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw error; // Vuelve a lanzar el error para que pueda ser manejado en otros lugares
    }
};

export const getRoles_1 = async () => {
    try {
        const response = await api.get('/roles/status-1'); // Ajusta la ruta según tu configuración
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw error; // Vuelve a lanzar el error para que pueda ser manejado en otros lugares
    }
};

export const insertRole = async (roleData) => {
    try {
        const response = await api.post('/roles/insert-roles', roleData);
        return response.data?.message || 'Rol insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el rol';
        console.error('Error al insertar el rol:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateRoleStatus = async (roleData) => {
    try {
        // Realizar solicitud POST para actualizar el estado del rol
        const response = await api.post('/roles/update-status', roleData);
        
        // Retornar el mensaje de éxito o la respuesta completa
        return response.data.message || 'Estado del rol actualizado correctamente';
    } catch (error) {
        // Manejar cualquier error de la solicitud
        console.error('Error al actualizar el estado del rol:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el estado del rol');
    }
};

export const updateRole = async (roleData) => {
    try {
        const response = await api.post('/roles/update-rol', roleData); // Cambia la ruta según tu API
        return response.data?.message || 'Rol actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el rol';
        console.error('Error al actualizar el rol:', errorMessage);
        throw new Error(errorMessage);
    }
};