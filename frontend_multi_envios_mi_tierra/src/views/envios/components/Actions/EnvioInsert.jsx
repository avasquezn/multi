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
    Autocomplete
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { insertEnvio } from '../../../../services/EnviosService';
import { getClientes_1 } from '../../../../services/ClientesService';
import { getAllCountries } from '../../../../services/LocationService';

const InsertEnvio = ({ show, handleClose, onEnvioInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    
    const [formData, setFormData] = useState({
        cantidad_cajas: '',
        fk_cod_pais_origen: '',
        fk_cod_pais_destino: '',
        fk_cod_departamento: '',
        fk_cod_municipio: '',
        fk_cod_persona: '',
        num_envio: '',
        usr_creo: user?.nom_usuario || '',
        fk_cod_cliente: '',
        fk_cod_direccion: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [clientesData, countriesData] = await Promise.all([
                    getClientes_1(),
                    getAllCountries()
                ]);
                
                const clientesArray = Array.isArray(clientesData) ? clientesData : [];
                const countriesArray = Array.isArray(countriesData) ? countriesData : [];
                
                setClients(clientesArray);
                setCountries(countriesArray);
            } catch (error) {
                console.error('Error detallado al cargar datos iniciales:', error);
                setSnackbarMessage('Error al cargar datos iniciales: ' + (error.message || 'Error desconocido'));
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setClients([]);
                setCountries([]);
            }
        };
    
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                usr_creo: user.nom_usuario
            }));
        }
    }, [user]);

    const handleClientChange = (event, newValue) => {
        setSelectedClient(newValue);
        if (newValue) {
            setFormData(prevData => ({
                ...prevData,
                fk_cod_pais_origen: newValue.COD_PAIS || '',
                fk_cod_departamento: newValue.COD_DEPARTAMENTO || '',
                fk_cod_municipio: newValue.COD_MUNICIPIO || '',
                fk_cod_persona: newValue.COD_PERSONA || '',
                fk_cod_cliente: newValue.COD_CLIENTE || '',
                fk_cod_direccion: newValue.COD_DIRECCION || ''
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

        if (
            !formData.cantidad_cajas ||
            !formData.fk_cod_pais_origen ||
            !formData.fk_cod_pais_destino ||
            !formData.num_envio ||
            !formData.fk_cod_persona ||
            !formData.fk_cod_cliente
        ) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        console.log('Datos que se enviarán:', formData);

        setLoading(true);
        setError(null);

        try {
            const response = await insertEnvio(formData);
            setSnackbarMessage('Envío agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onEnvioInserted();
            handleCloseModal();
        } catch (err) {
            console.error('Error al agregar el envío:', err);
            setSnackbarMessage(err.message || 'Error al agregar el envío');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            cantidad_cajas: '',
            fk_cod_pais_origen: '',
            fk_cod_pais_destino: '',
            fk_cod_departamento: '',
            fk_cod_municipio: '',
            fk_cod_persona: '',
            num_envio: '',
            usr_creo: user?.nom_usuario || '',
            fk_cod_cliente: '',
            fk_cod_direccion: ''
        });
        setSelectedClient(null);
        setError(null);
        handleClose();
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const findOptionByCode = (options, code, codeField) => {
        return options.find(option => option[codeField] === code) || null;
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
                    Agregar Envío
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input type="hidden" name="codCliente" value={formData.fk_cod_cliente} />
                        <input type="hidden" name="fk_cod_direccion" value={formData.fk_cod_direccion} />

                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => option ? option.NOM_PERSONA || '' : ''}
                            value={selectedClient}
                            onChange={handleClientChange}
                            isOptionEqualToValue={(option, value) => 
                                option?.COD_PERSONA === value?.COD_PERSONA
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar Cliente"
                                    required
                                />
                            )}
                        />

                        <TextField
                            label="Cantidad de Cajas"
                            name="cantidad_cajas"
                            type="number"
                            value={formData.cantidad_cajas}
                            onChange={handleChange}
                            required
                        />
                        
                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option ? option.NOM_PAIS || '' : ''}
                            value={findOptionByCode(countries, formData.fk_cod_pais_destino, 'COD_PAIS')}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    fk_cod_pais_destino: newValue?.COD_PAIS || ''
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="País de origen"
                                    required
                                />
                            )}
                        />
                        
                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => option ? option.NOM_PAIS || '' : ''}
                            value={findOptionByCode(clients, formData.fk_cod_pais_origen, 'COD_PAIS')}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    fk_cod_pais_origen: newValue?.COD_PAIS || ''
                                }));
                            }}
                            disabled
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="País de destino"
                                    required
                                />
                            )}
                        />

                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => option ? option.NOM_DEPARTAMENTO || '' : ''}
                            value={findOptionByCode(clients, formData.fk_cod_departamento, 'COD_DEPARTAMENTO')}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    fk_cod_departamento: newValue?.COD_DEPARTAMENTO || ''
                                }));
                            }}
                            disabled
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Departamento"
                                    required
                                />
                            )}
                        />

                        <Autocomplete
                            options={clients}
                            getOptionLabel={(option) => option ? option.NOM_MUNICIPIO || '' : ''}
                            value={findOptionByCode(clients, formData.fk_cod_municipio, 'COD_MUNICIPIO')}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    fk_cod_municipio: newValue?.COD_MUNICIPIO || ''
                                }));
                            }}
                            disabled
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Municipio"
                                    required
                                />
                            )}
                        />

                        <TextField
                            label="Dirección"
                            value={selectedClient?.DIRECCION || ''}
                            disabled
                            fullWidth
                            multiline
                        />

                        <TextField
                            label="Número de Envío"
                            name="num_envio"
                            value={formData.num_envio}
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

export default InsertEnvio;