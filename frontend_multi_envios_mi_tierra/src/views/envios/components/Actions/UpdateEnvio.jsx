import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Divider,
    Snackbar,
    Alert,
    useTheme
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { updateNumEnvio } from '../../../../services/EnviosService';
import PropTypes from 'prop-types';

const UpdateEnvio = ({ show, handleClose, onEnvioUpdated, initialEnvioData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_envio: '',
        num_envio: '',
        usr_modifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialEnvioData) {
            setFormData({
                cod_envio: initialEnvioData.COD_ENVIO || '',
                num_envio: initialEnvioData.NUM_ENVIO || '',
                usr_modifico: user?.nom_usuario || ''
            });
        }
    }, [initialEnvioData, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await updateNumEnvio(formData);

            setSnackbarMessage('Número de envío actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onEnvioUpdated();
            handleCloseModal();
        } catch (err) {
            console.error('Error al actualizar el envío:', err);
            setError(err.message || 'Error al actualizar el envío');
            setSnackbarMessage(err.message || 'Error al actualizar el envío');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            cod_envio: '',
            num_envio: '',
            usr_modifico: user?.nom_usuario || ''
        });
        setError(null);
        handleClose();
    };

    return (
        <>
            <Dialog
                open={show}
                onClose={(event, reason) => {
                    if (reason === 'backdropClick') return;
                    handleCloseModal();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        boxShadow: theme.shadows[5],
                        backgroundColor: theme.palette.background.paper,
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                    }}
                >
                    Actualizar Número de Envío
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Número de Envío"
                            name="num_envio"
                            placeholder="Ingrese el nuevo número de envío"
                            value={formData.num_envio}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                        
                        {error && (
                            <Box sx={{ color: 'red', textAlign: 'center' }}>
                                {error}
                            </Box>
                        )}
                        <DialogActions sx={{ mt: 2 }}>
                            <Button
                                onClick={handleCloseModal}
                                color="error"
                                variant="contained"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

UpdateEnvio.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onEnvioUpdated: PropTypes.func.isRequired,
    initialEnvioData: PropTypes.shape({
        COD_ENVIO: PropTypes.number,
        NUM_ENVIO: PropTypes.string
    })
};

export default UpdateEnvio;