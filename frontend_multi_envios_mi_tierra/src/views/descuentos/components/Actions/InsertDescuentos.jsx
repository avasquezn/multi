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
import { insertDiscount, getDiscountTypes } from '../../../../services/descuentosService';

const InsertDiscount = ({ show, handleClose, onDiscountInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fkCodTipoDescuento: '',
        nombre: '',
        cantidad: '',
        usrCreo: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [discountTypes, setDiscountTypes] = useState([]);

    useEffect(() => {
        const fetchDiscountTypes = async () => {
            try {
                const types = await getDiscountTypes();
                setDiscountTypes(types);
            } catch (error) {
                console.error('Error fetching discount types:', error);
            }
        };
    
        fetchDiscountTypes();
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fkCodTipoDescuento || !formData.nombre || !formData.cantidad) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await insertDiscount(formData);

            setSnackbarMessage('Descuento agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onDiscountInserted();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al agregar el descuento');
            setSnackbarMessage(err.message || 'Error al agregar el descuento');
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
            fkCodTipoDescuento: '',
            nombre: '',
            cantidad: '',
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
    <InputLabel id="discount-type-label">Tipo de descuento</InputLabel>
    <Select
        labelId="discount-type-label"
        id="discount-type-select"
        name="fkCodTipoDescuento"
        value={formData.fkCodTipoDescuento}
        onChange={handleChange}
        label="Tipo de descuento"
        variant="outlined"
        fullWidth
        sx={{
            borderRadius: '8px',
            '&:hover': {
                borderColor: theme.palette.primary.main,
            },
        }}
    >
        {discountTypes.map((type) => (
            <MenuItem key={type.COD_TIPO_DESCUENTO} value={type.COD_TIPO_DESCUENTO}>
                {type.DETALLE}
            </MenuItem>
        ))}
    </Select>
</FormControl>

                        <TextField
                            label="Nombre del descuento"
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
                            type="number"
                            placeholder="Ingrese la cantidad"
                            value={formData.cantidad}
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

export default InsertDiscount;
