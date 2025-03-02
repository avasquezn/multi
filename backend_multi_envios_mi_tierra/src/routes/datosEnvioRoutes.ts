import { Router } from 'express';
import { insertDatosEnvio, getDatosEnvio, updateNumEnvio } from '../controllers/datosEnvioController';

const router = Router();

router.get('/', getDatosEnvio);
router.post('/insert-datos-envio', insertDatosEnvio);
router.put('/update-num-envio', updateNumEnvio);

export default router;
