import express from 'express';
import { passReset, updatePassword } from '../controllers/passResetController'; // Adjust the import path as needed

const router = express.Router();

// Route for email verification
router.post('/password-reset', passReset);
router.post('/password', updatePassword)

export default router;