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
    useTheme,
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { updateDiscount } from '../../../../services/descuentosService'; // Servicio para actualizar descuentos

const UpdateDiscount = ({ show, handleClose, onDiscountUpdated, initialDiscountData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        codDesc: '',
        fkCodTipoDesc: '',
        nombre: '',
        cantidad: '',
        usrModifico: user?.nom_usuario || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialDiscountData) {
            setFormData({
                codDesc: initialDiscountData.COD_DESCUENTO,
                fkCodTipoDesc: initialDiscountData.FK_COD_TIPO_DESCUENTO,
                nombre: initialDiscountData.NOMBRE,
                cantidad: initialDiscountData.CANTIDAD,
                usrModifico: user?.nom_usuario || '',
            });
        }
    }, [initialDiscountData, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const message = await updateDiscount(formData);

            setSnackbarMessage('Descuento actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onDiscountUpdated();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al actualizar el descuento:', err);
            setSnackbarMessage(err.message || 'Error al actualizar el descuento');
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
            codDesc: '',
            fkCodTipoDesc: '',
            nombre: '',
            cantidad: '',
            usrModifico: user?.nom_usuario || '',
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
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    Actualizar
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <input type="hidden" name="codDesc" value={formData.codDesc} />
                        <TextField
                            label="Código Tipo Descuento"
                            name="fkCodTipoDesc"
                            placeholder="Ingrese el código del tipo de descuento"
                            value={formData.fkCodTipoDesc}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Nombre"
                            name="nombre"
                            placeholder="Ingrese el nombre del descuento"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Cantidad"
                            name="cantidad"
                            placeholder="Ingrese la cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            type="number"
                        />
                        {error && (
                            <Box sx={{ color: 'red', textAlign: 'center' }}>{error}</Box>
                        )}
                    </Box>
                </DialogContent>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
                    <Button
                        onClick={handleCloseModal}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: '8px' }}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: '8px' }}
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

export default UpdateDiscount;
