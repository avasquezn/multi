import api from '../utils/Fetch';

// Obtener todos los clientes
export const getClientes = async () => {
    try {
        const response = await api.get('/clientes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        throw error;
    }
};

export const getClientes_1 = async () => {
    try {
        const response = await api.get('/clientes');
        
        // Asegurarse de que response.data existe y es un array
        const clientes = Array.isArray(response.data) ? response.data : 
                        (response.data?.data ? response.data.data : []);
        
        return clientes;
    } catch (error) {
        console.error('Error al obtener los clientes:');
        throw error;
    }
};

export const getClientesEnvio = async () => {
    try {
        const response = await api.get('/clientes/cliente-envio');
        
        // Asegurarse de que response.data existe y es un array
        const clientes = Array.isArray(response.data) ? response.data : 
                        (response.data?.data ? response.data.data : []);
        
        return clientes;
    } catch (error) {
        console.error('Error al obtener los clientes:');
        throw error;
    }
};

// Insertar un nuevo cliente
export const insertCliente = async (clienteData) => {
    try {
        const response = await api.post('/clientes/insert-cliente', clienteData);
        return response.data?.message || 'Cliente insertado correctamente.';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el cliente.';
        console.error('Error al insertar el cliente:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateCliente = async (clienteData) => {
    try {
        const response = await api.post('/clientes/update-cliente', clienteData);
        return response.data?.message || 'Cliente actualizado correctamente.';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el cliente.';
        console.error('Error al actualizar el cliente:', errorMessage);
        throw new Error(errorMessage);
    }
};