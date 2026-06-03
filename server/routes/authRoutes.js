import express from 'express';
import { forgotPassword, login, logout, me, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, me);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
