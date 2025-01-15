import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Multi-Envios_jwt_login');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('Multi-Envios_refresh_token');
        const { data } = await api.post('/auth/refresh-token', { refreshToken });
        localStorage.setItem('Multi-Envios_jwt_login', data.token);
        localStorage.setItem('Multi-Envios_refresh_token', data.refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/auth/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;