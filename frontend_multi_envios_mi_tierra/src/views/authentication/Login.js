import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Grid, Box, Card, Typography, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../actions/authContext';

import PageContainer from 'src/components/container/PageContainer';
import AuthLogin from './auth/AuthLogin';

// Importa el logo
import MECLogo from 'src/assets/images/logos/MEC.png';

const Login2 = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (location.state?.unauthorized) {
      setOpenSnackbar(true);
    }
  }, [location]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                {/* Reemplaza el componente <Logo /> con la imagen del logo */}
                <img src={MECLogo} alt="MEC Logo" style={{ maxWidth: '150px', height: 'auto' }} />
              </Box>
              <AuthLogin
                title="Bienvenido"
                subtext={
                  <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                    Tu página de gestión de envíos
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Acceso denegado. Por favor, inicie sesión para continuar
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Login2;
