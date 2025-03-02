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
    MenuItem,
    useTheme
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { updatePaqueteEstado } from '../../../../services/PaqueteService';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const estados = [
    { value: 0, label: 'Pendiente' },
    { value: 1, label: 'En tránsito' },
    { value: 2, label: 'Entregado' },
];

const UpdatePaquete = ({ show, handleClose, onPaqueteUpdated, initialPaqueteData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_paquete: '',
        estado: 0,
        fec_entrega: null,
        usr_modifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialPaqueteData) {
            setFormData({
                cod_paquete: initialPaqueteData.COD_PAQUETE,
                estado: initialPaqueteData.ESTADO,
                fec_entrega: initialPaqueteData.FEC_ENTREGA,
                usr_modifico: user?.nom_usuario || ''
            });
        }
    }, [initialPaqueteData, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, fec_entrega: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await updatePaqueteEstado({
                ...formData,
                fec_entrega: formData.fec_entrega ? 
                    new Date(formData.fec_entrega).toISOString().split('T')[0] : 
                    null
            });

            setSnackbarMessage('Paquete actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPaqueteUpdated();
            handleCloseModal();
        } catch (err) {
            console.error('Error al actualizar el paquete:', err);
            setError(err.message || 'Error al actualizar el paquete');
            setSnackbarMessage(err.message || 'Error al actualizar el paquete');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleCloseModal = () => {
        setFormData({
            cod_paquete: '',
            estado: 0,
            fec_entrega: null,
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
                    Actualizar Estado del Paquete
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            select
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        >
                            {estados.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Entrega"
                                value={formData.fec_entrega ? dayjs(formData.fec_entrega) : null}
                                onChange={(newValue) => {
                                    handleDateChange(newValue ? newValue.format('YYYY-MM-DD') : null);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>

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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

UpdatePaquete.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onPaqueteUpdated: PropTypes.func.isRequired,
    initialPaqueteData: PropTypes.shape({
        COD_PAQUETE: PropTypes.number,
        ESTADO: PropTypes.number,
        FEC_ENTREGA: PropTypes.string
    })
};

export default UpdatePaquete;