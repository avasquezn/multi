import api from '../utils/Fetch'; // Utiliza tu configuración de axios con el baseURL

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/reset/password-reset', { email });
    return response.data;
  } catch (error) {
    // Manejar el error de manera adecuada
    throw error.response ? error.response.data : new Error('Error en la solicitud de restablecimiento de contraseña.');
  }
};

export const updatePassword = async (cod_usuario, nueva_contrasena, usr_modifico) => {
  try {
    const response = await api.post('/reset/password', {
      cod_usuario,
      nueva_contrasena,
      usr_modifico
    });
    return response.data;
  } catch (error) {
    // Manejo estructurado del error, priorizando la respuesta del servidor
    if (error.response?.data) {
      throw error.response.data;
    } else if (error.response) {
      throw new Error(`Error ${error.response.status}: Error al actualizar la contraseña`);
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al actualizar la contraseña');
    }
  }
};