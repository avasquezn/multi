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
import { updatePrice } from '../../../../services/PricesService';

const UpdatePrice = ({ show, handleClose, onPriceUpdated, initialPriceData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        codPais: '',
        codPrecio: '',
        nuevoPrecio: '',
        usrModifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialPriceData) {
            setFormData({
                codPais: initialPriceData.FK_COD_PAIS,
                codPrecio: initialPriceData.COD_PRECIO,
                nuevoPrecio: initialPriceData.PRECIO,
                usrModifico: user?.nom_usuario || ''
            });
        }
    }, [initialPriceData, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const message = await updatePrice(formData);

            setSnackbarMessage('Precio actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPriceUpdated();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al actualizar el precio:', err);

            setError(err.message || 'Error al actualizar el precio');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            codPais: '',
            codPrecio: '',
            nuevoPrecio: '',
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
                            name="codPais"
                            value={formData.codPais}
                        />
                        <input
                            type="hidden"
                            name="codPrecio"
                            value={formData.codPrecio}
                        />
                        <TextField
                            label="Nuevo Precio"
                            name="nuevoPrecio"
                            placeholder="Ingrese el nuevo precio"
                            value={formData.nuevoPrecio}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            type="number"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
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

export default UpdatePrice;