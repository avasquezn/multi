import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl, 
    Box, 
    Divider,
    Snackbar,
    Alert,
    useTheme
} from '@mui/material';
import { useAuth } from '../../../../actions/authContext';
import { insertCliente } from '../../../../services/ClientesService';
import { getAllCountries, getCountriesWithDepartments, getCitiesByCountryAndDepartment } from '../../../../services/LocationService';
import { getGenders_1 } from '../../../../services/GenderService';

const InsertCliente = ({ show, handleClose, onClienteInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        id_persona: '',
        nom_persona: '',
        fk_cod_genero: '',
        fk_cod_pais: '',
        fk_cod_departamento: '',
        fk_cod_municipio: '',
        telefono: '',
        correo: '',
        direccion: '',
        usr_creo: user?.nom_usuario || ''
    });

    const [countries, setCountries] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [genders, setGenders] = useState([]);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                usr_creo: user.nom_usuario
            }));
        }
        fetchInitialData();
    }, [user]);

    const fetchInitialData = async () => {
        try {
            await Promise.all([
                fetchCountries(),
                fetchGenders()
            ]);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Error al cargar los datos iniciales');
        }
    };

    const fetchCountries = async () => {
        try {
            const countriesData = await getAllCountries();
            setCountries(countriesData);
        } catch (error) {
            console.error('Error al obtener los países:', error);
            throw error;
        }
    };

    const fetchDepartments = async (countryCode) => {
        try {
            const departmentsData = await getCountriesWithDepartments(countryCode);
            setDepartments(departmentsData);
            setCities([]); // Limpiar ciudades cuando se cambia el país
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
            throw error;
        }
    };

    const fetchCities = async (countryCode, departmentCode) => {
        try {
            const citiesData = await getCitiesByCountryAndDepartment(countryCode, departmentCode);
            setCities(citiesData);
        } catch (error) {
            console.error('Error al obtener las ciudades:', error);
            throw error;
        }
    };

    const fetchGenders = async () => {
        try {
            const gendersData = await getGenders_1();
            setGenders(gendersData);
        } catch (error) {
            console.error('Error al obtener los géneros:', error);
            throw error;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Manejo de cambios específicos para ubicación
        if (name === 'fk_cod_pais') {
            setFormData(prevData => ({
                ...prevData,
                fk_cod_departamento: '',
                fk_cod_municipio: ''
            }));
            fetchDepartments(value);
        } else if (name === 'fk_cod_departamento') {
            setFormData(prevData => ({
                ...prevData,
                fk_cod_municipio: ''
            }));
            fetchCities(formData.fk_cod_pais, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos requeridos
        const requiredFields = [
            'id_persona',
            'nom_persona',
            'fk_cod_genero',
            'fk_cod_pais',
            'fk_cod_departamento',
            'fk_cod_municipio',
            'telefono',
            'correo',
            'direccion'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const message = await insertCliente(formData);
            setSnackbarMessage('Cliente agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onClienteInserted();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al agregar el cliente');
            setSnackbarMessage(err.message || 'Error al agregar el cliente');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            id_persona: '',
            nom_persona: '',
            fk_cod_genero: '',
            fk_cod_pais: '',
            fk_cod_departamento: '',
            fk_cod_municipio: '',
            telefono: '',
            correo: '',
            direccion: '',
            usr_creo: user?.nom_usuario || ''
        });
        setDepartments([]);
        setCities([]);
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
                    Agregar Cliente
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Datos personales */}
                        <TextField 
                            label="ID Persona" 
                            name="id_persona" 
                            value={formData.id_persona} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="Nombre Completo" 
                            name="nom_persona" 
                            value={formData.nom_persona} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />

                        <FormControl fullWidth required>
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

                        {/* Ubicación */}
                        <FormControl fullWidth required>
                            <InputLabel>País</InputLabel>
                            <Select
                                label="País"
                                name="fk_cod_pais"
                                value={formData.fk_cod_pais}
                                onChange={handleChange}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.COD_PAIS} value={country.COD_PAIS}>
                                        {country.NOM_PAIS}
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
                            <InputLabel>Ciudad</InputLabel>
                            <Select
                                label="Ciudad"
                                name="fk_cod_municipio"
                                value={formData.fk_cod_municipio}
                                onChange={handleChange}
                            >
                                {cities.map((city) => (
                                    <MenuItem key={city.COD_CIUDAD} value={city.COD_MUNICIPIO}>
                                        {city.NOM_MUNICIPIO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Datos de contacto */}
                        <TextField 
                            label="Teléfono" 
                            name="telefono" 
                            value={formData.telefono} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="Correo Electrónico" 
                            name="correo" 
                            type="email" 
                            value={formData.correo} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
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
                        />

                        {error && <Box sx={{ color: 'red', textAlign: 'center' }}>{error}</Box>}
                    </Box>
                </DialogContent>

                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogActions sx={{ backgroundColor: theme.palette.background.default }}>
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
                        variant="contained" 
                        color="primary" 
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
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default InsertCliente;