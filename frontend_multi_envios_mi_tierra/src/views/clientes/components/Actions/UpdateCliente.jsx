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
    FormControl,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { updateCliente } from '../../../../services/ClientesService';
import { getGenders_1 } from '../../../../services/GenderService';
import { 
    getAllCountries_1, 
    getAllDepartments_1, 
    getAllMunicipios_1 
} from '../../../../services/LocationService';

const UpdateClient = ({ show, handleClose, onClientUpdated, initialClientData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_persona: '',
        id_persona: '',
        nom_persona: '',
        fk_cod_genero: '',
        fk_cod_pais: '',
        fk_cod_departamento: '',
        fk_cod_municipio: '',
        telefono: '',
        correo: '',
        direccion: '',
        usr_modifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [genders, setGenders] = useState([]);
    const [countries, setCountries] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [municipios, setMunicipios] = useState([]);

    useEffect(() => {
        if (show) {
            fetchInitialData();
        }
    }, [show]);

    useEffect(() => {
        if (show && initialClientData) {
            populateFormData();
        }
    }, [initialClientData, user, show]);

    const fetchInitialData = async () => {
        try {
            const [genderData, countryData] = await Promise.all([
                getGenders_1(),
                getAllCountries_1()
            ]);
            setGenders(genderData || []);
            setCountries(countryData || []);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            showError('Error al cargar datos iniciales');
        }
    };

    const populateFormData = async () => {
        try {
            const newFormData = {
                cod_persona: initialClientData.COD_PERSONA || '',
                id_persona: initialClientData.ID_PERSONA || '',
                nom_persona: initialClientData.NOM_PERSONA || '',
                fk_cod_genero: initialClientData.COD_GENERO || '',
                fk_cod_pais: initialClientData.COD_PAIS || '',
                fk_cod_departamento: initialClientData.COD_DEPARTAMENTO || '',
                fk_cod_municipio: initialClientData.COD_MUNICIPIO || '',
                telefono: initialClientData.TELEFONO || '',
                correo: initialClientData.CORREO || '',
                direccion: initialClientData.DIRECCION || '',
                usr_modifico: user?.nom_usuario || ''
            };
            setFormData(newFormData);

            if (newFormData.fk_cod_pais) {
                const deptData = await getAllDepartments_1(newFormData.fk_cod_pais);
                setDepartments(deptData || []);
            }

            if (newFormData.fk_cod_departamento) {
                const munData = await getAllMunicipios_1(newFormData.fk_cod_departamento);
                setMunicipios(munData || []);
            }
        } catch (error) {
            console.error('Error al cargar datos del cliente:', error);
            showError('Error al cargar datos del cliente');
        }
    };

    const showError = (message) => {
        setError(message);
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    };

    const showSuccess = (message) => {
        setSnackbarMessage(message);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const validateForm = () => {
        const requiredFields = [
            'nom_persona', 'id_persona', 'fk_cod_genero', 'fk_cod_pais',
            'fk_cod_departamento', 'fk_cod_municipio', 'telefono', 'correo', 'direccion'
        ];
        
        const emptyFields = requiredFields.filter(field => !formData[field]);
        if (emptyFields.length > 0) {
            throw new Error('Todos los campos son requeridos');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            throw new Error('El correo electrónico no es válido');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        try {
            if (name === 'fk_cod_pais') {
                setDepartments([]);
                setMunicipios([]);
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    fk_cod_departamento: '',
                    fk_cod_municipio: ''
                }));

                if (value) {
                    const deptData = await getAllDepartments_1(value);
                    setDepartments(deptData || []);
                }
            } else if (name === 'fk_cod_departamento') {
                setMunicipios([]);
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    fk_cod_municipio: ''
                }));

                if (value) {
                    const munData = await getAllMunicipios_1(value);
                    setMunicipios(munData || []);
                }
            }
        } catch (error) {
            console.error('Error al cargar datos de ubicación:', error);
            showError('Error al cargar datos de ubicación');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            validateForm();
            const response = await updateCliente(formData);
            
            if (!response || response.error) {
                throw new Error(response?.Mensaje || 'Error al actualizar el cliente');
            }

            showSuccess('Cliente actualizado exitosamente');
            onClientUpdated();
            handleCloseModal();
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            showError(error.message || 'Error al actualizar el cliente');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            cod_persona: '',
            id_persona: '',
            nom_persona: '',
            fk_cod_genero: '',
            fk_cod_pais: '',
            fk_cod_departamento: '',
            fk_cod_municipio: '',
            telefono: '',
            correo: '',
            direccion: '',
            usr_modifico: user?.nom_usuario || ''
        });
        setDepartments([]);
        setMunicipios([]);
        setError(null);
        handleClose();
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Dialog open={show} onClose={handleCloseModal} maxWidth="sm" fullWidth>
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
                    Actualizar Cliente
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField 
                            label="Nombre de persona"
                            name="nom_persona"
                            value={formData.nom_persona}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(error && !formData.nom_persona)}
                        />

                        <TextField 
                            label="ID de persona"
                            name="id_persona"
                            value={formData.id_persona}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(error && !formData.id_persona)}
                        />

                        <FormControl fullWidth required error={Boolean(error && !formData.fk_cod_genero)}>
                            <InputLabel>Género</InputLabel>
                            <Select
                                label="Género"
                                name="fk_cod_genero"
                                value={formData.fk_cod_genero}
                                onChange={handleChange}
                            >
                                {genders.map((gender) => (
                                    <MenuItem key={gender.COD_GENERO} value={gender.COD_GENERO}>
                                        {gender.GENERO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required error={Boolean(error && !formData.fk_cod_pais)}>
                            <InputLabel>País</InputLabel>
                            <Select
                                label="País"
                                name="fk_cod_pais"
                                value={formData.fk_cod_pais}
                                onChange={handleChange}
                            >
                                {countries.map((pais) => (
                                    <MenuItem key={pais.COD_PAIS} value={pais.COD_PAIS}>
                                        {pais.NOM_PAIS}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required disabled={!formData.fk_cod_pais}>
                            <InputLabel>Departamento</InputLabel>
                            <Select
                                label="Departamento"
                                name="fk_cod_departamento"
                                value={formData.fk_cod_departamento}
                                onChange={handleChange}
                            >
                                {departments.map((department) => (
                                    <MenuItem key={department.COD_DEPARTAMENTO} value={department.COD_DEPARTAMENTO}>
                                        {department.NOM_DEPARTAMENTO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required disabled={!formData.fk_cod_departamento}>
                            <InputLabel>Municipio</InputLabel>
                            <Select
                                label="Municipio"
                                name="fk_cod_municipio"
                                value={formData.fk_cod_municipio}
                                onChange={handleChange}
                            >
                                {municipios.map((municipio) => (
                                    <MenuItem key={municipio.COD_MUNICIPIO} value={municipio.COD_MUNICIPIO}>
                                        {municipio.NOM_MUNICIPIO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField 
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(error && !formData.telefono)}
                        />

                        <TextField 
                            label="Correo electrónico"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(error && !formData.correo)}
                        />

                        <TextField 
                            label="Dirección"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            fullWidth
                            multiline
                            rows={2}
                            error={Boolean(error && !formData.direccion)}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
                    <Button
                        onClick={handleCloseModal}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
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

export default UpdateClient;