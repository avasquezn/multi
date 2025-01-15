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
import { updateBox } from '../../../../services/CajasService';
import { getPrices } from '../../../../services/PricesService';
import PropTypes from 'prop-types';

const UpdateBox = ({ show, handleClose, onBoxUpdated, initialCajaData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        codCaja: '',
        fkCodPrecio: '',
        idCaja: '',
        detalle: '',
        usrModifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prices, setPrices] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const pricesData = await getPrices();
                setPrices(pricesData);
            } catch (err) {
                console.error('Error al obtener los precios:', err);
                setError('No se pudieron cargar los precios');
            }
        };

        fetchPrices();
    }, []);

    useEffect(() => {
        if (initialCajaData) {
            setFormData({
                codCaja: initialCajaData.COD_CAJA || '',
                fkCodPrecio: initialCajaData.COD_PRECIO || '',
                idCaja: initialCajaData.ID_CAJA || '',
                detalle: initialCajaData.DETALLE || '',
                usrModifico: user?.nom_usuario || ''
            });
        }
    }, [initialCajaData, user]);

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
            const message = await updateBox(formData);

            setSnackbarMessage('Caja actualizada exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onBoxUpdated();
            handleCloseModal();
        } catch (err) {
            console.error('Error al actualizar la caja:', err);
            setError(err.message || 'Error al actualizar la caja');
            setSnackbarMessage(err.message || 'Error al actualizar la caja');
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
            fkCodPrecio: '',
            idCaja: '',
            detalle: '',
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
                        <TextField
                            select
                            label="Precio"
                            name="fkCodPrecio"
                            value={formData.fkCodPrecio}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        >
                            {prices.map(price => (
                                <MenuItem key={price.COD_PRECIO} value={price.COD_PRECIO}>
                                    {`${price.NOM_PAIS} - ${price.PRECIO}`}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="ID Caja"
                            name="idCaja"
                            placeholder="Ingrese el ID de la caja"
                            value={formData.idCaja}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Detalle"
                            name="detalle"
                            placeholder="Ingrese el detalle"
                            value={formData.detalle}
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

UpdateBox.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onBoxUpdated: PropTypes.func.isRequired,
    initialCajaData: PropTypes.shape({
        COD_PRECIO: PropTypes.string,
        ID_CAJA: PropTypes.string,
        DETALLE: PropTypes.string
    })
};

export default UpdateBox;
