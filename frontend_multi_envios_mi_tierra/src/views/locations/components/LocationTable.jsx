import React, { useState, useEffect } from 'react';
import { getPaisesConDetalles, insertPais } from '../../../services/LocationService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Typography,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  Box,
} from '@mui/material';
import { 
  ChevronRight, 
  ExpandMore
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import InsertPais from './Actions/InsertPais';
import InsertDepartamento from './Actions/InsertDepartamento';
import InsertMunicipio from './Actions/InsertMunicipio';

const LocationDetailsTable = () => {
  const [locationData, setLocationData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedCountries, setExpandedCountries] = useState(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [insertPaisOpen, setInsertPaisOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [insertDepartamentoOpen, setInsertDepartamentoOpen] = useState(false);
  const [insertMunicipioOpen, setInsertMunicipioOpen] = useState(false);

  const fetchLocationData = async () => {
    try {
      const data = await getPaisesConDetalles();
      setLocationData(data);
    } catch (error) {
      console.error('Error fetching location data', error);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const groupedData = locationData.reduce((acc, item) => {
    if (!acc[item.NOM_PAIS]) {
      acc[item.NOM_PAIS] = {};
    }
    if (!acc[item.NOM_PAIS][item.NOM_DEPARTAMENTO]) {
      acc[item.NOM_PAIS][item.NOM_DEPARTAMENTO] = new Set();
    }
    acc[item.NOM_PAIS][item.NOM_DEPARTAMENTO].add(item.NOM_MUNICIPIO);
    return acc;
  }, {});

  const toggleCountry = (countryName) => {
    setExpandedCountries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(countryName)) {
        newSet.delete(countryName);
      } else {
        newSet.add(countryName);
      }
      return newSet;
    });
  };

  const toggleDepartment = (countryName, departmentName) => {
    setExpandedDepartments(prev => {
      const key = `${countryName}|${departmentName}`;
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleInsertPais = () => {
    setInsertPaisOpen(true);
  };
  
  const handleCloseInsertPais = () => {
    setInsertPaisOpen(false);
  };

  const handlePaisInserted = async () => {
    fetchLocationData();
    setSnackbarMessage('País agregado exitosamente.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleInsertDepartamento = () => {
    setInsertDepartamentoOpen(true);
  };
  
  const handleCloseInsertDepartamento = () => {
    setInsertDepartamentoOpen(false);
  };
  
  const handleDepartamentoInserted = async () => {
    fetchLocationData();
    setSnackbarMessage('Departamento agregado exitosamente.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleInsertMunicipio = () => {
    setInsertMunicipioOpen(true);
  };
  
  const handleCloseInsertMunicipio = () => {
    setInsertMunicipioOpen(false);
  };
  
  const handleMunicipioInserted = async () => {
    fetchLocationData();
    setSnackbarMessage('Municipio agregado exitosamente.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsertPais}
          startIcon={<i className="bi bi-plus-circle" />}
        >
          Agregar país
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsertDepartamento}
          startIcon={<i className="bi bi-plus-circle" />}
        >
          Agregar departamento
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsertMunicipio}
          startIcon={<i className="bi bi-plus-circle" />}
        >
          Agregar municipio
        </Button>
      </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid #666' }}>
              <TableCell>País</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Municipio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedData).map(([countryName, departments]) => (
              <React.Fragment key={countryName}>
                <TableRow 
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => toggleCountry(countryName)}
                >
                  <TableCell>
                    <IconButton size="small" sx={{ mr: 1 }}>
                      {expandedCountries.has(countryName) ? <ExpandMore /> : <ChevronRight />}
                    </IconButton>
                    <Typography component="span">{countryName}</Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                
                {expandedCountries.has(countryName) && 
                  Object.entries(departments).map(([departmentName, municipalities]) => (
                    <React.Fragment key={departmentName}>
                      <TableRow 
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => toggleDepartment(countryName, departmentName)}
                      >
                        <TableCell></TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ mr: 1 }}>
                            {expandedDepartments.has(`${countryName}|${departmentName}`) ? 
                              <ExpandMore /> : 
                              <ChevronRight />
                            }
                          </IconButton>
                          <Typography component="span">{departmentName}</Typography>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      
                      {expandedDepartments.has(`${countryName}|${departmentName}`) && 
                        Array.from(municipalities).map((municipalityName) => (
                          <TableRow key={municipalityName}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Typography component="span">{municipalityName}</Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </React.Fragment>
                  ))
                }
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <InsertPais
        show={insertPaisOpen}
        handleClose={handleCloseInsertPais}
        onPaisInserted={handlePaisInserted}
      />

      <InsertDepartamento
        show={insertDepartamentoOpen}
        handleClose={handleCloseInsertDepartamento}
        onDepartamentoInserted={handleDepartamentoInserted}
      />

      <InsertMunicipio
        show={insertMunicipioOpen}
        handleClose={handleCloseInsertMunicipio}
        onMunicipioInserted={handleMunicipioInserted}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocationDetailsTable;
