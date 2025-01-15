import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../actions/authContext'; 
import { onlyLettersInput } from '../../../validations/Validations';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login, loading } = useAuth();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleUsernameChange = (e) => {
        const filteredValue = onlyLettersInput(e.target.value);
        setUsername(filteredValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(username, password); // Intenta iniciar sesión
        } catch (err) {
            console.error('Login failed:', err);
            setErrorMessage('Por favor revisar sus credenciales');
            setOpenSnackbar(true); // Muestra el mensaje de error
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false); // Cierra el Snackbar
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {title && (
                    <Typography fontWeight="700" variant="h2" mb={1}>
                        {title}
                    </Typography>
                )}

                {subtext}

                <Stack>
                    <Box>
                        <Typography variant="subtitle1"
                            fontWeight={600} component="label" htmlFor='username' mb="5px">Usuario</Typography>
                        <CustomTextField 
                            id="username" 
                            variant="outlined" 
                            fullWidth 
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </Box>
                    <Box mt="25px">
                        <Typography variant="subtitle1"
                            fontWeight={600} component="label" htmlFor='password' mb="5px" >Contraseña</Typography>
                        <CustomTextField 
                            id="password" 
                            type="password" 
                            variant="outlined" 
                            fullWidth 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                        <Typography
                            component={Link}
                            to="/auth/forgotPassword"
                            fontWeight="500"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Typography>
                    </Stack>
                </Stack>
                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'ingresar'}
                    </Button>
                </Box>
                {subtitle}
            </form>

            {/* Snackbar para mostrar mensajes de error */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AuthLogin;
