import api from '../utils/Fetch';

/**
 * Obtener los destinatarios de un cliente específico.
 * @param {number} codCliente - Código del cliente.
 * @returns {Promise<Object[]>} - Lista de destinatarios.
 */
export const getDestinatariosPorCliente = async (codCliente) => {
    try {
        const response = await api.get(`/destinatarios/${codCliente}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los destinatarios:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los destinatarios');
    }
};

/**
 * Insertar un nuevo destinatario.
 * @param {Object} destinatarioData - Datos del destinatario.
 * @returns {Promise<string>} - Mensaje de éxito o error.
 */
export const insertDestinatario = async (destinatarioData) => {
    try {
        const response = await api.post('/destinatarios/insert-destinatario', destinatarioData);
        return response.data?.message || 'Destinatario creado exitosamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al crear el destinatario';
        console.error('Error al insertar el destinatario:', errorMessage);
        throw new Error(errorMessage);
    }
};
