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
import { insertPrice } from '../../../../services/PricesService';
import { getAllCountries } from '../../../../services/LocationService';

const InsertPrice = ({ show, handleClose, onPriceInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fkCodPais: '',
        precio: '',
        usrCreo: user?.nom_usuario || ''
    });
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        // Obtener los países
        const fetchCountries = async () => {
            try {
                const countryData = await getAllCountries();
                setCountries(countryData);  // Asumiendo que el servicio devuelve un array de países
            } catch (err) {
                console.error('Error al obtener los países:', err);
            }
        };

        fetchCountries();
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

        if (!formData.fkCodPais || !formData.precio) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const message = await insertPrice(formData);
            console.log('Precio insertado:', message);

            setSnackbarMessage('Precio agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPriceInserted();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al insertar el precio:', err);

            setError(err.message || 'Error al agregar el precio');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            fkCodPais: '',
            precio: '',
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
                            <InputLabel id="country-label">País</InputLabel>
                            <Select
                                labelId="country-label"
                                id="country-select"
                                name="fkCodPais"
                                value={formData.fkCodPais}
                                onChange={handleChange}
                                label="País"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.COD_PAIS} value={country.COD_PAIS}>
                                        {country.NOM_PAIS}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Precio"
                            name="precio"
                            placeholder="Ingrese precio"
                            value={formData.precio}
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

export default InsertPrice;
