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
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { insertBox } from '../../../../services/CajasService'; // Cambié el servicio de precios por el de cajas
import { getPrices } from '../../../../services/PricesService'; // Cambié el servicio de países por precios

const InsertCaja = ({ show, handleClose, onBoxInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fkCodPrecio: '',
        idCaja: '',
        detalle: '',
        usrCreo: user?.nom_usuario || ''
    });
    const [prices, setPrices] = useState([]); // Usamos precios en lugar de países
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        // Obtener los precios
        const fetchPrices = async () => {
            try {
                const priceData = await getPrices();
                setPrices(priceData);  // Asumiendo que el servicio devuelve un array de precios
            } catch (err) {
                console.error('Error al obtener los precios:', err);
            }
        };

        fetchPrices();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                usrCreo: user.nom_usuario
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fkCodPrecio || !formData.idCaja || !formData.detalle) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const message = await insertBox(formData);
            console.log('Caja insertada:', message);

            setSnackbarMessage('Caja agregada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onBoxInserted();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al insertar la caja:', err);

            setError(err.message || 'Error al agregar la caja');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            fkCodPrecio: '',
            idCaja: '',
            detalle: '',
            usrCreo: user?.nom_usuario || ''
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
                    Agregar
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="price-label">Precio</InputLabel>
                            <Select
                                labelId="price-label"
                                id="price-select"
                                name="fkCodPrecio"
                                value={formData.fkCodPrecio}
                                onChange={handleChange}
                                label="Precio"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {prices.map((price) => (
                                    <MenuItem key={price.COD_PRECIO} value={price.COD_PRECIO}>
                                        {`${price.NOM_PAIS} - ${price.PRECIO}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="ID de Caja"
                            name="idCaja"
                            placeholder="Ingrese ID de caja"
                            value={formData.idCaja}
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
                        <TextField
                            label="Detalle"
                            name="detalle"
                            placeholder="Ingrese detalle"
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
                        {loading ? 'Guardando...' : 'Guardar'}
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

export default InsertCaja;
