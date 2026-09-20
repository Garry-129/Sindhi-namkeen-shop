import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'sindhi_namkeen_rohtak_secret_key_2026';
};

export const protectCustomer = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, getJwtSecret());

            // Check if token belongs to customer (has customer flag or customer id)
            if (decoded.role && decoded.role !== 'customer') {
                return res.status(401).json({ success: false, message: 'Invalid customer token token' });
            }

            req.customer = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
            };

            return next();
        } catch (error) {
            console.error('Customer JWT Verification Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized as customer, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, customer token required' });
    }
};
