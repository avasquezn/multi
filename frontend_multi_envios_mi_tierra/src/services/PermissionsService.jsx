import api from '../utils/Fetch';

export const getPermisos = async () => {
    try {
        const response = await api.get('/permisos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los permisos:', error);
        throw error;
    }
};

export const insertPermission = async (permisoData) => {
    try {
        const response = await api.post('/permisos/insert-permission', permisoData);
        return response.data?.message || 'Permiso insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el permiso';
        console.error('Error al insertar el permiso:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updatePermisoStatus = async (permisoData) => {
    try {
        // Realizar solicitud POST para actualizar el estado del rol
        const response = await api.post('/permisos/update-status', permisoData);
        
        // Retornar el mensaje de éxito o la respuesta completa
        return response.data.message || 'Estado del permiso actualizado correctamente';
    } catch (error) {
        // Manejar cualquier error de la solicitud
        console.error('Error al actualizar el estado del permiso:', error);
        throw new Error(error.response?.data?.message || 'Error al actualizar el estado del permiso');
    }
};

export const updatePermission = async (permissionData) => {
    try {
        const response = await api.post('/permisos/update-permission', permissionData);
        return response.data?.message || 'Permiso actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el permiso';
        console.error('Error al actualizar el permiso:', errorMessage);
        throw new Error(errorMessage);
    }
};
