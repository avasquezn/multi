import { Router } from 'express';
import { getPricesByCountry, insertPrice, updatePrice } from '../controllers/preciosController';

const router: Router = Router();

// Ruta para obtener precios por país
router.get('/', getPricesByCountry);

// Ruta para insertar un nuevo precio
router.post('/insert-price', insertPrice);

// Ruta para actualizar un precio existente
router.post('/update-price', updatePrice);

export default router;
