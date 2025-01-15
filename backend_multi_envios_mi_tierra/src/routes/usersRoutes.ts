import { Router } from 'express';
import { getUsers ,insertUser, updateUser, updateUserStatus } from '../controllers/userController';

const router: Router = Router();

router.get('/', getUsers);
router.post('/insert-user', insertUser);
router.post('/update-user', updateUser);
router.post('/update-status', updateUserStatus);

export default router;
