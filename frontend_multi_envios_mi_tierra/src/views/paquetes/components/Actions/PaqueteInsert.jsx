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
    Autocomplete,
    useTheme,
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { insertPaquete, getPaquetes } from '../../../../services/PaqueteService';

const PaqueteInsert = ({ show, handleClose, onPaqueteInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [paquetes, setPaquetes] = useState([]);
    const [selectedPaquete, setSelectedPaquete] = useState(null);

    const [formData, setFormData] = useState({
        fk_cod_caja: '',
        fk_cod_cliente: '',
        fk_cod_envio: '',
        fec_entrega: '',
        usr_creo: user?.nom_usuario || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchPaquetes = async () => {
            try {
                const data = await getPaquetes();
                setPaquetes(data);
            } catch (error) {
                console.error('Error al cargar paquetes:', error);
                setSnackbarMessage('Error al cargar paquetes: ' + (error.message || 'Error desconocido'));
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };

        fetchPaquetes();
    }, []);

    const handlePaqueteChange = (event, newValue) => {
        setSelectedPaquete(newValue);
        if (newValue) {
            setFormData(prevData => ({
                ...prevData,
                fk_cod_caja: newValue.FK_COD_CAJA || '',
                fk_cod_cliente: newValue.FK_COD_CLIENTE || '',
                fk_cod_envio: newValue.FK_COD_ENVIO || '',
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fk_cod_caja || !formData.fk_cod_cliente || !formData.fk_cod_envio || !formData.fec_entrega) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await insertPaquete(formData);
            setSnackbarMessage('Paquete agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPaqueteInserted();
            handleCloseModal();
        } catch (err) {
            console.error('Error al agregar el paquete:', err);
            setSnackbarMessage(err.message || 'Error al agregar el paquete');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            fk_cod_caja: '',
            fk_cod_cliente: '',
            fk_cod_envio: '',
            fec_entrega: '',
            usr_creo: user?.nom_usuario || ''
        });
        setSelectedPaquete(null);
        setError(null);
        handleClose();
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                    Agregar Paquete
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            options={paquetes}
                            getOptionLabel={(option) => `Paquete #${option.COD_PAQUETE} - Envío: ${option.NUM_ENVIO}`}
                            value={selectedPaquete}
                            onChange={handlePaqueteChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar Paquete"
                                    required
                                />
                            )}
                        />

                        <TextField
                            label="Caja"
                            name="fk_cod_caja"
                            value={paquetes.find(p => p.FK_COD_CAJA === formData.fk_cod_caja)?.ID_CAJA || ''} // Mostrar solo ID_CAJA
                            onChange={handleChange} // Puedes desactivarlo si no es necesario editar directamente
                            disabled
                            required
                        />


                        <TextField
                            label="Cliente"
                            name="fk_cod_cliente"
                            value={paquetes.find(p => p.FK_COD_CLIENTE === formData.fk_cod_cliente)?.NOM_PERSONA || ''} // Mostrar solo NOM_PERSONA
                            disabled
                            required
                        />


                        <TextField
                            label="Fecha de Entrega"
                            name="fec_entrega"
                            type="datetime-local"
                            value={formData.fec_entrega}
                            onChange={handleChange}
                            required
                        />

                        {error && <Box sx={{ color: 'red', textAlign: 'center' }}>{error}</Box>}
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions>
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
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PaqueteInsert;
