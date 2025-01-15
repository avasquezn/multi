import { Router } from 'express';
import { getGeneros, getGeneros_1, insertGenero, updateGeneroStatus, updateGenero } from '../controllers/generosController';

const router: Router = Router();

// Rutas para géneros
router.get('/', getGeneros); // Obtener todos los géneros
router.get('/status-1', getGeneros_1); // Obtener todos los géneros
router.post('/insert-gender', insertGenero); // Insertar un género
router.post('/update-status', updateGeneroStatus); // Actualizar estado de un género
router.post('/update-gender', updateGenero); // Actualizar datos de un género

export default router;
