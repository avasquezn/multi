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
        // Asegurarte de que paqueteData cumple con el formato requerido
        if (!paqueteData || !paqueteData.paquetes || !Array.isArray(paqueteData.paquetes)) {
            throw new Error('El formato de paqueteData no es válido. Debe contener un campo "paquetes" con un arreglo.');
        }

        // Realizar la solicitud al endpoint
        const response = await api.post('/paquetes/insert-paquetes', paqueteData);

        // Retornar el mensaje de éxito o un mensaje por defecto
        return response.data?.message || 'Datos de paquete insertados correctamente';
    } catch (error) {
        // Manejo de errores más robusto
        const statusCode = error.response?.status;
        const errorMessage =
            error.response?.data?.message ||
            `Error al insertar los datos del paquete (Código de estado: ${statusCode || 'desconocido'})`;

        console.error('Error al insertar los datos del paquete:', errorMessage);

        // Lanza un error con más contexto
        throw new Error(errorMessage);
    }
};

export const getEnviosPorCliente = async (codCliente) => {
    try {
        const response = await api.get(`/paquetes/${codCliente}`);
        return response.data.success ? response.data.envios : [];
    } catch (error) {
        console.error('Error al obtener los envíos del cliente:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los envíos del cliente');
    }
};

export const updatePaqueteEstado = async (updateData) => {
    try {
        // Validación básica del código de paquete
        if (!updateData?.cod_paquete) {
            throw new Error('Se requiere el código del paquete para actualizar');
        }

        const response = await api.put('/paquetes/actualizar-estado', updateData);
        
        return response.data?.message || 'Paquete actualizado exitosamente';
    } catch (error) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || 
            `Error al actualizar el paquete (Código ${statusCode || 'desconocido'})`;
        
        console.error('Error en updatePaqueteEstado:', errorMessage);
        
        throw new Error(errorMessage);
    }
};

export const updatePaquetesEstadoMasivo = async (updateData) => {
    try {
        if (!updateData?.usr_modifico || !Array.isArray(updateData?.paquetes) || updateData.paquetes.length === 0) {
            throw new Error('El formato de updateData no es válido. Debe contener "usr_modifico" y un arreglo de "paquetes".');
        }

        const response = await api.put('/paquetes/actualizar-estado-masivo', updateData);
        return response.data?.message || 'Paquetes actualizados exitosamente';
    } catch (error) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || 
            `Error al actualizar los paquetes masivamente (Código ${statusCode || 'desconocido'})`;

        console.error('Error en updatePaquetesEstadoMasivo:', errorMessage);
        throw new Error(errorMessage);
    }
};
