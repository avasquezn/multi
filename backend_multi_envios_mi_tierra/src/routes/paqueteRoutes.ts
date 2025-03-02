import { Router } from 'express';
import { 
    insertPaquete, 
    getPaquetes, 
    getEnviosPorCliente, 
    updatePaqueteEstado,
    updatePaquetesEstadoMasivo
} from '../controllers/paqueteController';

const router = Router();

router.get('/', getPaquetes);
router.post('/insert-paquetes', insertPaquete);
router.get('/:codCliente', getEnviosPorCliente);
router.put('/actualizar-estado', updatePaqueteEstado);
router.put('/actualizar-estado-masivo', updatePaquetesEstadoMasivo);

export default router;
