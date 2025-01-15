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
import { insertMunicipio, getCountriesWithDepartments, getAllCountries_1 } from '../../../../services/LocationService';
import { useAuth } from '../../../../actions/authContext';

const InsertMunicipio = ({ show, handleClose, onMunicipioInserted }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    p_nom_municipio: '',
    p_usr_creo: user?.nom_usuario || '',
    p_fk_cod_departamento: '',
    p_id_postal: ''
  });
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryData = await getAllCountries_1();
        setCountries(countryData);
      } catch (err) {
        console.error('Error al obtener los países:', err);
        setError('Error al cargar los países');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedCountry) {
        try {
          setLoading(true);
          const deparmentData = await getCountriesWithDepartments(selectedCountry);
          setDepartamentos(deparmentData);
          setError(null);
        } catch (err) {
          console.error('Error al obtener los departamentos:', err);
          setError('Error al cargar los departamentos');
          setDepartamentos([]);
        } finally {
          setLoading(false);
        }
      } else {
        setDepartamentos([]);
      }
    };

    fetchDepartments();
  }, [selectedCountry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    // Reset department selection when country changes
    setFormData(prev => ({
      ...prev,
      p_fk_cod_departamento: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.p_nom_municipio || !formData.p_fk_cod_departamento || !formData.p_id_postal) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await insertMunicipio(formData);
      setSnackbarMessage('Municipio agregado exitosamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      onMunicipioInserted();
      handleCloseModal();
    } catch (err) {
      console.error('Error al agregar el municipio:', err);
      setSnackbarMessage(err.message || 'Error al agregar el municipio');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      p_nom_municipio: '',
      p_usr_creo: user?.nom_usuario || '',
      p_fk_cod_departamento: '',
      p_id_postal: ''
    });
    setSelectedCountry('');
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
          Agregar Municipio
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="País"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              {countries.map((country) => (
                <MenuItem key={country.COD_PAIS} value={country.COD_PAIS}>
                  {country.NOM_PAIS}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Departamento"
              name="p_fk_cod_departamento"
              value={formData.p_fk_cod_departamento}
              onChange={handleChange}
              required
              disabled={!selectedCountry || loading}
            >
              {departamentos.map((departamento) => (
                <MenuItem key={departamento.COD_DEPARTAMENTO} value={departamento.COD_DEPARTAMENTO}>
                  {departamento.NOM_DEPARTAMENTO}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nombre del Municipio"
              name="p_nom_municipio"
              value={formData.p_nom_municipio}
              onChange={handleChange}
              required
            />
            <TextField
              label="Código Postal"
              name="p_id_postal"
              value={formData.p_id_postal}
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

export default InsertMunicipio;