import { Router } from 'express';
import { insertCliente, getClientes, updateCliente } from '../controllers/clienteController';

const router = Router();

router.get('/', getClientes);
router.post('/insert-cliente', insertCliente);
router.post('/update-cliente', updateCliente);

export default router;
