import api from '../utils/Fetch';

export const loginService = async (nom_usuario, contrasena) => {
  const { data } = await api.post('/auth/login', { nom_usuario, contrasena });
  return data;
};

export const refreshTokenService = async (refreshToken) => {
  const { data } = await api.post('/auth/refresh-token', { refreshToken });
  return data;
};