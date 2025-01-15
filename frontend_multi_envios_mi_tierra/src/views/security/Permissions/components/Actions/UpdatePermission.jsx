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
    FormControlLabel,
    Switch,
    Typography,
    alpha
} from '@mui/material';
import { useAuth } from '../../../../../actions/authContext';
import { updatePermission } from '../../../../../services/PermissionsService';

const UpdatePermission = ({ show, handleClose, onPermissionUpdated, initialPermissionData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_permiso: '',
        permiso_inserccion: false,
        permiso_eliminacion: false,
        permiso_actualizacion: false,
        permiso_consultar: false,
        permiso_reporte: false,
        usr_modifico: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialPermissionData && user) {
            setFormData({
                cod_permiso: initialPermissionData.COD_PERMISO,
                permiso_inserccion: Boolean(initialPermissionData.DES_PERMISO_INSERCCION),
                permiso_eliminacion: Boolean(initialPermissionData.DES_PERMISO_ELIMINACION),
                permiso_actualizacion: Boolean(initialPermissionData.DES_PERMISO_ACTUALIZACION),
                permiso_consultar: Boolean(initialPermissionData.DES_PERMISO_CONSULTAR),
                permiso_reporte: Boolean(initialPermissionData.PERMISO_REPORTE),
                usr_modifico: user.nom_usuario || ''
            });
        }
    }, [initialPermissionData, user]);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToUpdate = {
                ...formData,
                permiso_inserccion: Number(formData.permiso_inserccion),
                permiso_eliminacion: Number(formData.permiso_eliminacion),
                permiso_actualizacion: Number(formData.permiso_actualizacion),
                permiso_consultar: Number(formData.permiso_consultar),
                permiso_reporte: Number(formData.permiso_reporte),
            };

            await updatePermission(dataToUpdate);
            setSnackbarMessage('Permiso actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            onPermissionUpdated();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al actualizar el permiso');
            setSnackbarMessage('Error al actualizar el permiso');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error('Error al actualizar el permiso:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            cod_permiso: '',
            permiso_inserccion: false,
            permiso_eliminacion: false,
            permiso_actualizacion: false,
            permiso_consultar: false,
            permiso_reporte: false,
            usr_modifico: user?.nom_usuario || ''
        });
        setError(null);
        handleClose();
    };

    const PermissionSwitch = ({ name, label }) => (
        <FormControlLabel
            control={
                <Switch
                    checked={formData[name]}
                    onChange={handleChange}
                    name={name}
                    color="primary"
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                />
            }
            label={
                <Typography 
                    variant="body1" 
                    sx={{ 
                        fontWeight: 500,
                        color: formData[name] ? 
                            theme.palette.primary.main : 
                            theme.palette.text.secondary 
                    }}
                >
                    {label}
                </Typography>
            }
            sx={{
                backgroundColor: formData[name] ? 
                    alpha(theme.palette.primary.main, 0.05) : 
                    'transparent',
                padding: '8px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: formData[name] ? 
                        alpha(theme.palette.primary.main, 0.08) : 
                        alpha(theme.palette.grey[500], 0.05),
                },
                width: '100%',
                margin: 0
            }}
        />
    );

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
                <DialogContent sx={{ backgroundColor: theme.palette.background.default, p: 3 }}>
                    <Box sx={{ mb: 3, mt: 3 }}>
                        <TextField
                            label="Rol"
                            value={initialPermissionData?.NOM_ROL}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputProps={{
                                readOnly: true,
                                sx: {
                                    backgroundColor: theme.palette.grey[50],
                                    borderRadius: '8px',
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: theme.palette.text.primary,
                                        color: theme.palette.text.primary,
                                    },
                                }
                            }}
                        />
                        <TextField
                            label="Objeto"
                            value={initialPermissionData?.NOM_OBJETO}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                                sx: {
                                    backgroundColor: theme.palette.grey[50],
                                    borderRadius: '8px',
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: theme.palette.text.primary,
                                        color: theme.palette.text.primary,
                                    },
                                }
                            }}
                        />
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <PermissionSwitch name="permiso_inserccion" label="Permiso de Inserción" />
                        <PermissionSwitch name="permiso_eliminacion" label="Permiso de Eliminación" />
                        <PermissionSwitch name="permiso_actualizacion" label="Permiso de Actualización" />
                        <PermissionSwitch name="permiso_consultar" label="Permiso de Consulta" />
                        <PermissionSwitch name="permiso_reporte" label="Permiso de Reporte" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    backgroundColor: theme.palette.background.default,
                    p: 2,
                    gap: 1
                }}>
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
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                    elevation={6}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UpdatePermission;