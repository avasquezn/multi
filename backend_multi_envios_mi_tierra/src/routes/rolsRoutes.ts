import { Router } from 'express';
import { getRoles, getRoles_1, insertRole, updateRoleStatus, updateRole } from '../controllers/rolsController';

const router: Router = Router();

router.get('/', getRoles);
router.get('/status-1', getRoles_1);
router.post('/insert-roles', insertRole);
router.post('/update-status', updateRoleStatus);
router.post('/update-rol', updateRole);

export default router;