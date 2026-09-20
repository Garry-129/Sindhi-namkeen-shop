import express from 'express';
import { loginAdmin, verifyAdmin, changePassword } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { adminLoginLimiter } from '../middleware/rateLimiter.js';
import { validateAdminLogin, validateChangePassword } from '../middleware/sanitize.js';

const router = express.Router();

// Public route with rate limiting (max 5 failed attempts per 15 min per IP) and validation
router.post('/login', adminLoginLimiter, validateAdminLogin, loginAdmin);

// Protected admin routes
router.get('/me', protectAdmin, verifyAdmin);
router.put('/change-password', protectAdmin, validateChangePassword, changePassword);

export default router;
