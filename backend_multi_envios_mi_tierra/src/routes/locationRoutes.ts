import { Router } from 'express';
import { insertarPais, insertarDepartamento, insertarMunicipio, getAllCountries, getCountriesWithDepartments, 
getCitiesByCountryAndDepartment, getCitiesByDepartment, getAllDeparments_1, getAllMunicipios_1, getPaisesConDetalles } from '../controllers/locationController';

const router: Router = Router();

// Ruta para insertar un país
router.post('/insertar-pais', insertarPais);
router.post('/insertar-departamento', insertarDepartamento);
router.post('/insertar-municipio', insertarMunicipio);

router.get('/countries', getAllCountries);
router.get('/countries_1', getAllCountries);

// Ruta para obtener países con departamentos
router.get('/departments', getCountriesWithDepartments);
router.get('/departments_1', getAllDeparments_1);

// Ruta para obtener ciudades de un país y departamento específicos
router.get('/cities', getCitiesByCountryAndDepartment);
router.get('/cities_1', getAllMunicipios_1);

router.get('/citiesByDeparment', getCitiesByDepartment);

router.get('/countries-details', getPaisesConDetalles);

export default router;