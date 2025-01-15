import api from '../utils/Fetch';

export const validateToken = async (token) => {
    try {
        const response = await api.post('/auth/validate-reset-token', {
            token
        });

        // Assuming response.data contains the parsed JSON response
        const data = response.data;

        // Check if the response indicates the token is invalid
        if (!data || !data.valid) {
            // Handle validation errors
            throw new Error(data?.message || 'El token no es válido o ha expirado');
        }

        // Return the validation response data
        return {
            valid: true,
            cod_usuario: data.cod_usuario,
            nom_usuario: data.nom_usuario,
            message: data.message
        };

    } catch (error) {
        console.error('Error al validar el token:', error);
        
        // Handle different types of errors
        if (error instanceof TypeError) {
            throw new Error('Error de conexión al servicio de validación');
        }
        
        // Re-throw the error with the original message if it's our custom error
        throw error instanceof Error ? error : new Error('Error desconocido al validar el token');
    }
};