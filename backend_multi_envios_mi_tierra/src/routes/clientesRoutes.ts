import { Router } from 'express';
import { insertCliente, getClientes, updateCliente, getClientesEnvio } from '../controllers/clienteController';

const router = Router();

router.get('/', getClientes);
router.get('/cliente-envio', getClientesEnvio);
router.post('/insert-cliente', insertCliente);
router.post('/update-cliente', updateCliente);

export default router;
