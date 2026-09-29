import express from 'express';
import {
    requestCustomerOtp,
    verifyCustomerOtp,
    getCustomerProfile,
    updateCustomerProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getCustomerOrders,
} from '../controllers/customerController.js';
import { protectCustomer } from '../middleware/customerAuthMiddleware.js';
import { requestCustomerOtpLimiter, verifyCustomerOtpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public auth routes
router.post('/request-otp', requestCustomerOtpLimiter, requestCustomerOtp);
router.post('/verify-otp', verifyCustomerOtpLimiter, verifyCustomerOtp);

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
