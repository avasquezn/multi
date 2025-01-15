import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    Alert,
    Paper
} from '@mui/material';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { requestPasswordReset } from '../../../../services/ForgotPasswordService'; // Ajusta la ruta según tu proyecto

const ForgotPasswordForm = ({ showSnackbar }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await requestPasswordReset(email);
            showSnackbar('Correo de restablecimiento enviado', 'success');
        } catch (err) {
            setError(err.message || 'Error en el restablecimiento de contraseña');
            showSnackbar(err.message || 'Error en el restablecimiento de contraseña', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 4, width: '100%' }}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Olvidaste tu contraseña
                </Typography>

                <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={3}>
                    Por favor ingrese un correo electrónico para formatear su contraseña.
                </Typography>

                <Box mb={3}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="email"
                        mb={1}
                    >
                        Correo electrónico
                    </Typography>
                    <CustomTextField
                        id="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Box>

                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Cambiar contraseña'}
                </Button>

                <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="500">
                        ¿Recuerdas tu contraseña?
                    </Typography>
                    <Typography
                        component={Link}
                        to="/auth/login"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        Sign In
                    </Typography>
                </Stack>
            </form>
        </Paper>
    );
};

export default ForgotPasswordForm;
