import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateToken } from '../../../../services/ValidateTokenService';
import { updatePassword } from '../../../../services/ForgotPasswordService';

export const useResetPassword = () => {
  const [formState, setFormState] = useState({
    newPassword: '',
    confirmPassword: '',
    loading: false,
    tokenValidated: false,
    cod_usuario: null,
    nom_usuario: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromUrl = () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const state = searchParams.get('state');
      
      if (!state) {
        return null;
      }

      const decodedToken = atob(state);
      return decodedToken;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        const token = getTokenFromUrl();
        
        if (!token) {
          throw new Error('No se encontró el token de reseteo en la URL');
        }

        setFormState(prev => ({ ...prev, loading: true }));
        
        const validationResult = await validateToken(token);
        
        setFormState(prev => {
          const newState = { 
            ...prev, 
            tokenValidated: true,
            cod_usuario: validationResult.cod_usuario,
            nom_usuario: validationResult.nom_usuario
          };
          return newState;
        });
        
        setSnackbar({
          open: true,
          message: 'Token validado correctamente',
          severity: 'success'
        });

      } catch (error) {
        console.error('Error completo en validateResetToken:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Error al validar el token',
          severity: 'error'
        });
        
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setFormState(prev => ({ ...prev, loading: false }));
      }
    };

    validateResetToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword, cod_usuario, nom_usuario } = formState;

    if (!cod_usuario) {
      setSnackbar({
        open: true,
        message: 'No se pudo identificar el usuario',
        severity: 'error'
      });
      return;
    }

    const userModifier = nom_usuario || 'User';

    try {
      setFormState(prev => ({ ...prev, loading: true }));
      
      await updatePassword(
        cod_usuario,
        newPassword,
        userModifier
      );
      
      setSnackbar({
        open: true,
        message: 'Contraseña actualizada exitosamente',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/auth/login');
      }, 600);

    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al actualizar la contraseña',
        severity: 'error'
      });
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePasswordChange = (field) => (e) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
  };

  return {
    formState,
    snackbar,
    handleSubmit,
    handleCloseSnackbar,
    handlePasswordChange
  };
};