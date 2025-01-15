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
} from '@mui/material';
import { insertDepartamento, getAllCountries_1 } from '../../../../services/LocationService';
import { useAuth } from '../../../../actions/authContext';

const InsertDepartamento = ({ show, handleClose, onDepartamentoInserted }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    p_nom_departamento: '',
    p_usr_creo: user?.nom_usuario || '',
    p_fk_cod_pais: '',
  });
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        // Obtener los países
        const fetchCountries = async () => {
            try {
                const countryData = await getAllCountries_1();
                setCountries(countryData);  // Asumiendo que el servicio devuelve un array de países
            } catch (err) {
                console.error('Error al obtener los países:', err);
            }
        };

        fetchCountries();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.p_nom_departamento || !formData.p_fk_cod_pais) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await insertDepartamento(formData);
      setSnackbarMessage('Departamento agregado exitosamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      onDepartamentoInserted();
      handleCloseModal();
    } catch (err) {
      console.error('Error al agregar el departamento:', err);
      setSnackbarMessage(err.message || 'Error al agregar el departamento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      p_nom_departamento: '',
      p_usr_creo: user?.nom_usuario || '',
      p_fk_cod_pais: '',
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
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          Agregar Departamento
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="País"
              name="p_fk_cod_pais"
              value={formData.p_fk_cod_pais}
              onChange={handleChange}
              required
            >
              {countries.map((country) => (
                <MenuItem key={country.COD_PAIS} value={country.COD_PAIS}>
                  {country.NOM_PAIS}
                </MenuItem>
              ))}
            </TextField>
            {error && <Box sx={{ color: 'red', textAlign: 'center' }}>{error}</Box>}
            <TextField
              label="Nombre del Departamento"
              name="p_nom_departamento"
              value={formData.p_nom_departamento}
              onChange={handleChange}
              required
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
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
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InsertDepartamento;
