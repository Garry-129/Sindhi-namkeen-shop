import express from 'express';
import {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getCustomerOrders,
} from '../controllers/customerController.js';
import { protectCustomer } from '../middleware/customerAuthMiddleware.js';
import { customerAuthLimiter } from '../middleware/rateLimiter.js';
import { validateCustomerRegister, validateCustomerLogin } from '../middleware/sanitize.js';

const router = express.Router();

// Public auth routes
router.post('/register', customerAuthLimiter, validateCustomerRegister, registerCustomer);
router.post('/login', customerAuthLimiter, validateCustomerLogin, loginCustomer);

// Protected customer profile routes
router.get('/me', protectCustomer, getCustomerProfile);
router.put('/me', protectCustomer, updateCustomerProfile);

// Protected address management routes
router.post('/addresses', protectCustomer, addAddress);
router.put('/addresses/:id', protectCustomer, updateAddress);
router.delete('/addresses/:id', protectCustomer, deleteAddress);

// Protected customer order history route
router.get('/orders', protectCustomer, getCustomerOrders);

export default router;
