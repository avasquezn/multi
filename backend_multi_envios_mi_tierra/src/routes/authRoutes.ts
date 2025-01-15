import express from 'express';
import { login, refreshToken, getUser } from '../controllers/authController';
import { validateResetToken } from '../helpers/ValidateToken';

const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/user', getUser);

router.post('/validate-reset-token', validateResetToken);

export default router;
