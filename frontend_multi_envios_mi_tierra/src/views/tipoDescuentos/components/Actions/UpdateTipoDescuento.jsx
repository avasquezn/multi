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
import { updateDiscountType } from '../../../../services/descuentosService'; // Servicio de actualización para descuentos

const UpdateDiscountType = ({ show, handleClose, onDiscountUpdated, initialDiscountData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        codTipoDesc: '',
        detalle: '',
        esPorcentaje: false,
        usrModifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialDiscountData) {
            setFormData({
                codTipoDesc: initialDiscountData.COD_TIPO_DESCUENTO, // Asegúrate de que coincida exactamente
                detalle: initialDiscountData.DETALLE,
                esPorcentaje: initialDiscountData.ES_PORCENTAJE,
                usrModifico: user?.nom_usuario || ''
            });
        }
    }, [initialDiscountData, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleTogglePorcentaje = () => {
        setFormData({
            ...formData,
            esPorcentaje: !formData.esPorcentaje
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const message = await updateDiscountType(formData);

            setSnackbarMessage('Tipo de descuento actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onDiscountUpdated();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al actualizar el tipo de descuento:', err);
            setSnackbarMessage(err.message || 'Error al actualizar el tipo de descuento');
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
            codTipoDesc: '',
            detalle: '',
            esPorcentaje: false,
            usrModifico: user?.nom_usuario || ''
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
                    Actualizar
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input
                            type="hidden"
                            name="codTipoDesc"
                            value={formData.codTipoDesc}
                        />
                        <TextField
                            label="Detalle"
                            name="detalle"
                            placeholder="Ingrese el detalle del descuento"
                            value={formData.detalle}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                label="Es porcentaje"
                                name="esPorcentaje"
                                value={formData.esPorcentaje ? 'Sí' : 'No'}
                                onClick={handleTogglePorcentaje}
                                readOnly
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    sx: {
                                        borderRadius: '8px',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Box>
                        {error && (
                            <Box sx={{ color: 'red', textAlign: 'center' }}>
                                {error}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
                    <Button
                        onClick={handleCloseModal}
                        color="error"
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                            },
                        }}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                </DialogActions>
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

export default UpdateDiscountType;
