import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    Box, 
    Divider,
    Snackbar,
    Alert,
    useTheme,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { useAuth } from '../../../../../actions/authContext';
import { insertPermission } from '../../../../../services/PermissionsService';
import { getRoles } from '../../../../../services/RolsService';
import { getObjects } from '../../../../../services/ObjectService';

const InsertPermission = ({ show, handleClose, onPermissionInserted }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [roles, setRoles] = useState([]);
    const [objects, setObjects] = useState([]);
    const [formData, setFormData] = useState({
        fk_cod_rol: '',
        fk_cod_objeto: '',
        permiso_inserccion: false,
        permiso_eliminacion: false,
        permiso_actualizacion: false,
        permiso_consultar: false,
        permiso_reporte: false,
        usr_creo: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Separate fetch functions for better error handling
    const fetchRoles = async () => {
        try {
            const rolesData = await getRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error('Error fetching roles:');
            setSnackbarMessage('Error al cargar los roles');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    const fetchObjects = async () => {
        try {
            const objectsData = await getObjects();
            setObjects(objectsData);
        } catch (error) {
            console.error('Error fetching objects:');
            setSnackbarMessage('Error al cargar los objetos');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    // Fetch roles and objects when component mounts
    useEffect(() => {
        const loadData = async () => {
            if (show) {
                setLoading(true);
                const rolesSuccess = await fetchRoles();
                const objectsSuccess = await fetchObjects();
                
                if (!rolesSuccess || !objectsSuccess) {
                    setError('Error al cargar los datos necesarios');
                }
                setLoading(false);
            }
        };

        loadData();
    }, [show]);

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                usr_creo: user.nom_usuario
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fk_cod_rol || !formData.fk_cod_objeto) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const message = await insertPermission(formData);
            setSnackbarMessage('Permiso agregado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onPermissionInserted();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            fk_cod_rol: '',
            fk_cod_objeto: '',
            permiso_inserccion: false,
            permiso_eliminacion: false,
            permiso_actualizacion: false,
            permiso_consultar: false,
            permiso_reporte: false,
            usr_creo: user?.nom_usuario || ''
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
                        <FormControl fullWidth required error={!!error && !formData.fk_cod_rol}>
                            <InputLabel id="rol-label">Rol</InputLabel>
                            <Select
                                labelId="rol-label"
                                name="fk_cod_rol"
                                value={formData.fk_cod_rol}
                                onChange={handleChange}
                                label="Rol"
                                disabled={loading || roles.length === 0}
                                sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {roles.map((rol) => (
                                    <MenuItem key={rol.COD_ROL} value={rol.COD_ROL}>
                                        {`${rol.COD_ROL} - ${rol.NOM_ROL}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && !formData.fk_cod_rol && (
                                <FormHelperText>Seleccione un rol</FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth required error={!!error && !formData.fk_cod_objeto}>
                            <InputLabel id="objeto-label">Objeto</InputLabel>
                            <Select
                                labelId="objeto-label"
                                name="fk_cod_objeto"
                                value={formData.fk_cod_objeto}
                                onChange={handleChange}
                                label="Objeto"
                                disabled={loading || objects.length === 0}
                                sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {objects.map((objeto) => (
                                    <MenuItem key={objeto.COD_OBJETO} value={objeto.COD_OBJETO}>
                                        {`${objeto.COD_OBJETO} - ${objeto.NOM_OBJETO}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && !formData.fk_cod_objeto && (
                                <FormHelperText>Seleccione un objeto</FormHelperText>
                            )}
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox checked={formData.permiso_inserccion} onChange={handleChange} name="permiso_inserccion" />}
                            label="Permiso de Inserción"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.permiso_eliminacion} onChange={handleChange} name="permiso_eliminacion" />}
                            label="Permiso de Eliminación"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.permiso_actualizacion} onChange={handleChange} name="permiso_actualizacion" />}
                            label="Permiso de Actualización"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.permiso_consultar} onChange={handleChange} name="permiso_consultar" />}
                            label="Permiso de Consulta"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.permiso_reporte} onChange={handleChange} name="permiso_reporte" />}
                            label="Permiso de Reporte"
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
                        type="submit" 
                        onClick={handleSubmit} 
                        color="primary" 
                        variant="contained" 
                        sx={{ 
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Agregar'}
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

export default InsertPermission;
