import { Router } from 'express';
import { insertDestinatario, getDestinatariosPorCliente } from '../controllers/destinatarioController';

const router = Router();

router.get('/:cod_cliente', getDestinatariosPorCliente);
router.post('/insert-destinatario', insertDestinatario);

export default router;
