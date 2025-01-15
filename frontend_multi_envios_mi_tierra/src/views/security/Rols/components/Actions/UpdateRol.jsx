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
    useTheme
} from '@mui/material';
import { useAuth } from '../../../../../actions/authContext';
import { updateRole } from '../../../../../services/RolsService';

const UpdateRol = ({ show, handleClose, onRoleUpdated, initialRoleData }) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        cod_rol: '',
        nom_rol: '',
        des_rol: '',
        usr_modifico: user?.nom_usuario || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (initialRoleData) {
            setFormData({
                cod_rol: initialRoleData.COD_ROL,
                nom_rol: initialRoleData.NOM_ROL,
                des_rol: initialRoleData.DES_ROL,
                usr_modifico: user?.nom_usuario || ''
            });
        }
    }, [initialRoleData, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const message = await updateRole(formData);

            setSnackbarMessage('Rol actualizado exitosamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            onRoleUpdated();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            console.error('Error al actualizar el rol:', err);

            setError(err.message || 'Error al actualizar el rol');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setFormData({
            nom_rol: '',
            des_rol: '',
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
                    Actualizar
                </DialogTitle>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nombre del rol"
                            name="nom_rol"
                            placeholder="Ingrese nombre del rol"
                            value={formData.nom_rol}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Descripción del rol"
                            name="des_rol"
                            placeholder="Ingrese descripción del rol"
                            value={formData.des_rol}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
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

export default UpdateRol;