import { createContext, useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authReducer, initialState } from '../reducers/authReducer';
import api from '../utils/Fetch'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const loadUser = async () => {
    const token = localStorage.getItem('Multi-Envios_jwt_login');
    if (token) {
      try {
        dispatch({ type: 'LOADING' });
        const { data } = await api.get('/auth/user');
        dispatch({ type: 'LOGIN_SUCCESS', payload: { 
          user: data.usuario,
          roles: data.roles // Ensure the backend sends roles information
        }});
      } catch (error) {
        console.error('Error loading user data', error);
        handleAuthError(error);
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleAuthError = (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('Multi-Envios_jwt_login');
      localStorage.removeItem('Multi-Envios_refresh_token');
      dispatch({ type: 'AUTH_ERROR' });
      navigate('/auth/login');
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (nom_usuario, contrasena) => {
    try {
      dispatch({ type: 'LOADING' });
      const { data } = await api.post('/auth/login', { nom_usuario, contrasena });
      localStorage.setItem('Multi-Envios_jwt_login', data.token);
      localStorage.setItem('Multi-Envios_refresh_token', data.refreshToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { 
        user: data.usuario,
        roles: data.roles // Ensure the backend sends roles information
      }});
      navigate('/dashboard');
    } catch (error) {
      console.error('Error de inicio de sesión', error);
      dispatch({ type: 'AUTH_ERROR', payload: { error: 'Login failed. Please try again.' } });
    }
  };

  const logout = () => {
    localStorage.removeItem('Multi-Envios_jwt_login');
    localStorage.removeItem('Multi-Envios_refresh_token');
    dispatch({ type: 'LOGOUT' });
    navigate('/auth/login');
  };

  const value = {
    user: state.user,
    roles: state.roles, // Make roles available in the context
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};