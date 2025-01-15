import { Router } from 'express';
import { getBoxesWithCountry, insertBox, updateBox } from '../controllers/cajasController';

const router: Router = Router();

router.get('/', getBoxesWithCountry);

// Ruta para insertar un nuevo precio
router.post('/insert-box', insertBox);

// Ruta para actualizar un precio existente
router.post('/update-box', updateBox);

export default router;
