import React, { useState } from 'react';
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
import { insertPais } from '../../../../services/LocationService';

const InsertPais = ({ show, handleClose, onPaisInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        p_nom_pais: '',
        p_num_zona: '',
        p_usr_creo: user?.nom_usuario || '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.p_nom_pais || !formData.p_num_zona) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await insertPais(formData);
            setSnackbarMessage('País agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPaisInserted(); // Notifica al componente padre que se agregó un nuevo país
            handleCloseModal();
        } catch (err) {
            console.error('Error al agregar el país:', err);
            setSnackbarMessage(err.message || 'Error al agregar el país');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            p_nom_pais: '',
            p_num_zona: '',
            p_usr_creo: user?.nom_usuario || '',
        });
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
                    Agregar País
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="País"
                            name="p_nom_pais"
                            value={formData.p_nom_pais}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Código del País"
                            name="p_num_zona"
                            value={formData.p_num_zona}
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default InsertPais;
