import express from 'express';
import { createOrder, getOrders, updateOrderStatus, trackOrder } from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { generalPublicLimiter } from '../middleware/rateLimiter.js';
import { validateOrderInput } from '../middleware/sanitize.js';

const router = express.Router();

// Order creation with input validation
router.post('/', validateOrderInput, createOrder);

// Order tracking with public rate limiter (max 100 requests per 15 mins)
router.get('/track', generalPublicLimiter, trackOrder);
router.get('/track/:orderNumber', generalPublicLimiter, trackOrder);

// Admin protected routes
router.get('/', protectAdmin, getOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
