import { Router } from 'express';
import { insertDatosEnvio, getDatosEnvio } from '../controllers/datosEnvioController';

const router = Router();

router.get('/', getDatosEnvio);
router.post('/insert-datos-envio', insertDatosEnvio);

export default router;
