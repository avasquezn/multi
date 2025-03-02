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
import { insertPaquete, getPaquetes, getEnviosPorCliente } from '../../../../services/PaqueteService';
import { getClientesEnvio } from '../../../../services/ClientesService';
import { getBoxesWithCountry } from '../../../../services/CajasService';
import { getDiscounts } from '../../../../services/descuentosService'; // Importar el servicio de descuentos

const PaqueteInsert = ({ show, handleClose, onPaqueteInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [paquetes, setPaquetes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [envios, setEnvios] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [discounts, setDiscounts] = useState([]); // Estado para los descuentos
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedEnvio, setSelectedEnvio] = useState(null);
    const [selectedBoxes, setSelectedBoxes] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null); // Estado para el descuento seleccionado
    const [boxCodigos, setBoxCodigos] = useState('');

    const [formData, setFormData] = useState({
        fk_cod_caja: '',
        fk_cod_cliente: '',
        fk_cod_envio: '',
        fk_cod_descuento: '', // Nuevo campo para el descuento
        fec_entrega: '',
        usr_creo: user?.nom_usuario || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const clientesData = await getClientesEnvio();
                setClientes(clientesData);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
                setSnackbarMessage('Error al cargar clientes: ' + (error.message || 'Error desconocido'));
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };
    
        if (show) {
            fetchClientes();
        }
    }, [show]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [paquetesData, clientesData, boxesData, discountsData] = await Promise.all([
                    getPaquetes(),
                    getClientesEnvio(),
                    getBoxesWithCountry(),
                    getDiscounts() // Obtener los descuentos
                ]);
                setPaquetes(paquetesData);
                setClientes(clientesData);
                setBoxes(boxesData);
                setDiscounts(discountsData); // Establecer los descuentos
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setSnackbarMessage('Error al cargar datos: ' + (error.message || 'Error desconocido'));
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };
    
        fetchInitialData();
    }, []);

    const handleClienteChange = async (event, newValue) => {
        setSelectedCliente(newValue);
        setSelectedEnvio(null);
        setEnvios([]);
    
        if (newValue) {
            try {
                const response = await getEnviosPorCliente(newValue.COD_CLIENTE);
                const enviosArray = Object.values(response || {});
                setEnvios(enviosArray);
                setFormData(prevData => ({
                    ...prevData,
                    fk_cod_cliente: newValue.COD_CLIENTE || ''
                }));
            } catch (error) {
                console.error('Error al obtener envíos:', error);
            }
        }
    };

    const handleEnvioChange = (event, newValue) => {
        setSelectedEnvio(newValue);
        if (newValue) {
            setSelectedBoxes([]);
            setFormData(prevData => ({
                ...prevData,
                fk_cod_envio: newValue.CodigoEnvio ? String(newValue.CodigoEnvio) : '',
                fk_cod_caja: newValue.CantidadCajas ? String(newValue.CantidadCajas) : ''
            }));
        }
    };

    const handleDiscountChange = (event, newValue) => {
        setSelectedDiscount(newValue);
        setFormData(prevData => ({
            ...prevData,
            fk_cod_descuento: newValue?.COD_DESCUENTO || ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleBoxSelectionChange = (event, newValues) => {
        const maxBoxes = selectedEnvio ? parseInt(selectedEnvio.CantidadCajas) : 0;
        
        if (newValues.length <= maxBoxes) {
            setSelectedBoxes(newValues);
            const codigos = newValues.map(box => box.COD_CAJA).join(',');
            setBoxCodigos(codigos);
            setFormData(prevData => ({
                ...prevData,
                fk_cod_caja: selectedEnvio.CantidadCajas
            }));
        } else {
            setSnackbarMessage(`No puedes seleccionar más de ${maxBoxes} cajas`);
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedBoxes.length || !formData.fk_cod_cliente || !formData.fk_cod_envio) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }
    
        const requiredBoxes = selectedEnvio ? parseInt(selectedEnvio.CantidadCajas) : 0;

        if (selectedBoxes.length < requiredBoxes) {
            setError(`Debes seleccionar exactamente ${requiredBoxes} cajas para poder agregar el paquete`);
            return;
        }

        const dataToSubmit = {
            paquetes: selectedBoxes.map((box) => ({
                fk_cod_caja: box.COD_CAJA,
                fk_cod_cliente: formData.fk_cod_cliente,
                fk_cod_envio: formData.fk_cod_envio,
                fk_cod_descuento: formData.fk_cod_descuento || null, // Incluir el descuento
                fec_entrega: formData.fec_entrega || null,
                usr_creo: formData.usr_creo,
            })),
        };
    
        setLoading(true);
        setError(null);
    
        try {
            await insertPaquete(dataToSubmit);
            setSnackbarMessage('Paquetes agregados exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
    
            onPaqueteInserted();
            handleCloseModal();
        } catch (err) {
            console.error('Error al agregar los paquetes:', err);
            setSnackbarMessage(err.message || 'Error al agregar los paquetes');
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
            fk_cod_descuento: '', // Reiniciar el campo de descuento
            fec_entrega: '',
            usr_creo: user?.nom_usuario || ''
        });
        setSelectedBoxes([]);
        setSelectedCliente(null);
        setSelectedEnvio(null);
        setSelectedDiscount(null); // Reiniciar el descuento seleccionado
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
                            options={clientes}
                            getOptionLabel={(option) => 
                                option ? `${option.NOM_PERSONA} (${option.NOM_PAIS})` : ''
                            }
                            value={selectedCliente}
                            onChange={handleClienteChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar Cliente"
                                    required
                                />
                            )}
                            isOptionEqualToValue={(option, value) => 
                                option?.COD_CLIENTE === value?.COD_CLIENTE
                            }
                        />

                        <Autocomplete
                            options={envios}
                            getOptionLabel={(option) => 
                                option && option.CodigoEnvio 
                                    ? `Envío #${option.CodigoEnvio} - Destinatario: ${option.NombreDestinatario}` 
                                    : ''
                            }
                            value={selectedEnvio}
                            onChange={handleEnvioChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar Envío"
                                    required
                                />
                            )}
                            isOptionEqualToValue={(option, value) => 
                                option?.CodigoEnvio === value?.CodigoEnvio
                            }
                        />

                        <TextField
                            label="Cantidad de Cajas"
                            name="fk_cod_caja"
                            value={formData.fk_cod_caja}
                            disabled
                            required
                        />

                        {selectedEnvio && selectedEnvio.CantidadCajas && (
                            <>
                                <Autocomplete
                                    multiple
                                    options={boxes}
                                    getOptionLabel={(option) => `${option.DETALLE} - ${option.NOM_PAIS}`}
                                    value={selectedBoxes}
                                    onChange={handleBoxSelectionChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Seleccionar Cajas (${selectedEnvio.CantidadCajas} disponibles)`}
                                            required
                                        />
                                    )}
                                    limitTags={2}
                                    isOptionEqualToValue={() => false}
                                    disableCloseOnSelect
                                />
                            </>
                        )}

                        {/* Selector de descuentos */}
                        <Autocomplete
                            options={discounts}
                            getOptionLabel={(option) => {
                                if (!option) return '';
                                const amountDisplay = option.ES_PORCENTAJE 
                                    ? `${option.CANTIDAD}%`
                                    : `$${option.CANTIDAD}`;
                                return `${option.NOMBRE} - ${amountDisplay}`;
                            }}
                            value={selectedDiscount}
                            onChange={handleDiscountChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar Descuento"
                                    placeholder="Seleccione un descuento opcional"
                                />
                            )}
                            isOptionEqualToValue={(option, value) => 
                                option?.COD_DESCUENTO === value?.COD_DESCUENTO
                            }
                        />

                        <TextField
                            label="Fecha de Entrega"
                            name="fec_entrega"
                            type="date"
                            value={formData.fec_entrega}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
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

export default PaqueteInsert;