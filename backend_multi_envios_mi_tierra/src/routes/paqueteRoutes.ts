import { Router } from 'express';
import { insertPaquete, getPaquetes } from '../controllers/paqueteController';

const router = Router();

router.get('/', getPaquetes);
router.post('/insert-paquetes', insertPaquete);

export default router;
