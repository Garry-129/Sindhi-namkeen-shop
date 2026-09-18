import express from 'express';
import { createOrder, getOrders, updateOrderStatus, trackOrder } from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/track', trackOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/', protectAdmin, getOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
