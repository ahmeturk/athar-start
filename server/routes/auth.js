import { Router } from 'express';
import { signup, login, googleAuth, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, signupSchema, loginSchema, googleAuthSchema } from '../middleware/validate.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleAuthSchema), googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
