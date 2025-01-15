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
import { updateUser } from '../../../../services/UsersService';
import { getGenders_1 } from '../../../../services/GenderService';
import { getRoles_1 } from '../../../../services/RolsService';
import { 
    getAllCountries_1, 
    getAllDepartments_1, 
    getAllMunicipios_1
} from '../../../../services/LocationService';

const UpdateUser = ({ show, handleClose, onUserUpdated, initialUserData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_usuario: '',
        nom_persona: '',
        id_persona: '',
        fk_cod_genero: '',
        fk_cod_pais: '',
        fk_cod_departamento: '',
        fk_cod_municipio: '',
        telefono: '',
        fk_cod_rol: '',
        usr_modifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [genders, setGenders] = useState([]);
    const [rols, setRoles] = useState([]);
    const [countries, setCountries] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [municipios, setMunicipios] = useState([]);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [genderData, roleData, countryData] = await Promise.all([
                    getGenders_1(),
                    getRoles_1(),
                    getAllCountries_1()
                ]);
                
                setGenders(genderData);
                setRoles(roleData);
                setCountries(countryData);
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };
        fetchInitialData();
    }, []);

    // Populate form with initial user data
    useEffect(() => {
        const populateLocationData = async () => {
            if (initialUserData) {
                const newFormData = {
                    cod_usuario: initialUserData.COD_USUARIO || '',
                    nom_persona: initialUserData.NOM_PERSONA || '',
                    id_persona: initialUserData.ID_PERSONA || '',
                    fk_cod_genero: initialUserData.FK_COD_GENERO || '',
                    fk_cod_pais: initialUserData.FK_COD_PAIS || '',
                    fk_cod_departamento: initialUserData.FK_COD_DEPARTAMENTO || '',
                    fk_cod_municipio: initialUserData.FK_COD_MUNICIPIO || '',
                    telefono: initialUserData.TELEFONO || '',
                    fk_cod_rol: initialUserData.FK_COD_ROL || '',
                    usr_modifico: user?.nom_usuario || ''
                };
                setFormData(newFormData);

                // Fetch departments for the selected country
                if (newFormData.fk_cod_pais) {
                    try {
                        const departmentsData = await getAllDepartments_1(newFormData.fk_cod_pais);
                        setDepartments(departmentsData);
                    } catch (error) {
                        console.error('Error al obtener los departamentos:', error);
                    }
                }

                // Fetch municipalities for the selected department
                if (newFormData.fk_cod_pais && newFormData.fk_cod_departamento) {
                    try {
                        const municipiosData = await getAllMunicipios_1(newFormData.fk_cod_departamento);
                        setMunicipios(municipiosData);
                    } catch (error) {
                        console.error('Error al obtener los municipios:', error);
                    }
                }
            }
        };

        populateLocationData();
    }, [initialUserData, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Handle cascading selects
        if (name === 'fk_cod_pais') {
            // Fetch departments for the selected country
            const fetchDepartments = async () => {
                try {
                    const departmentsData = await getAllDepartments_1(value);
                    setDepartments(departmentsData);
                    // Reset dependent fields
                    setFormData(prev => ({
                        ...prev,
                        fk_cod_departamento: '',
                        fk_cod_municipio: ''
                    }));
                } catch (error) {
                    console.error('Error al obtener los departamentos:', error);
                }
            };
            fetchDepartments();
        } else if (name === 'fk_cod_departamento') {
            // Fetch cities for the selected department
            const fetchCities = async () => {
                try {
                    const citiesData = await getAllMunicipios_1(value);
                    setMunicipios(citiesData);
                    // Reset municipality field
                    setFormData(prev => ({
                        ...prev,
                        fk_cod_municipio: ''
                    }));
                } catch (error) {
                    console.error('Error al obtener las ciudades:', error);
                }
            };
            fetchCities();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const message = await updateUser(formData);

            setSnackbarMessage('Usuario actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onUserUpdated();
            handleCloseModal();
        } catch (err) {
            console.error('Error al actualizar el usuario:', err);
            setError(err.message || 'Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            cod_usuario: '',
            nom_persona: '',
            id_persona: '',
            fk_cod_genero: '',
            fk_cod_pais: '',
            fk_cod_departamento: '',
            fk_cod_municipio: '',
            telefono: '',
            fk_cod_rol: '',
            usr_modifico: user?.nom_usuario || ''
        });
        setDepartments([]);
        setMunicipios([]);
        setError(null);
        handleClose();
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
                    Actualizar
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <input type="hidden" name="cod_usuario" value={formData.cod_usuario} />
                        <TextField label="Nombre de persona" name="nom_persona" value={formData.nom_persona} onChange={handleChange} required fullWidth />
                        <TextField label="ID de persona" name="id_persona" value={formData.id_persona} onChange={handleChange} required fullWidth />
                        
                        {/* Select para Género */}
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

                        <FormControl fullWidth required>
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
                                disabled={!formData.fk_cod_pais}
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
                                disabled={!formData.fk_cod_departamento}
                            >
                                {municipios.map((municipio) => (
                                    <MenuItem key={municipio.COD_MUNICIPIO} value={municipio.COD_MUNICIPIO}>
                                        {municipio.NOM_MUNICIPIO}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} required fullWidth />

                        <FormControl fullWidth required>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                label="Rol"
                                name="fk_cod_rol"
                                value={formData.fk_cod_rol}
                                onChange={handleChange}
                            >
                                {rols.map((rol) => (
                                    <MenuItem key={rol.COD_ROL} value={rol.COD_ROL}>
                                        {rol.NOM_ROL}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {error && <Box sx={{ color: 'red' }}>{error}</Box>}
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
                        type="submit"
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

export default UpdateUser;