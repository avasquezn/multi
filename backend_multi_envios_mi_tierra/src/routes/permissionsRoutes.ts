import { Router } from 'express';
import { getPermisos, insertPermission, updatePermisoStatus, updatePermission } from '../controllers/permissionsController';

const router: Router = Router();

router.get('/', getPermisos);
router.post('/insert-permission', insertPermission);
router.post('/update-status', updatePermisoStatus);
router.post('/update-permission', updatePermission);

export default router;