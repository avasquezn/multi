import { Router } from 'express';
import { getObjetos, insertObjeto, updateObjectStatus, updateObject } from '../controllers/objectsController';

const router: Router = Router();

router.get('/', getObjetos);
router.post('/insert-objects', insertObjeto);
router.post('/update-status', updateObjectStatus);
router.post('/update-object', updateObject);

export default router;