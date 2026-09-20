// Utility to recursively sanitize object inputs and prevent NoSQL injection ($ and . operator injection)
const sanitizeValue = (data) => {
    if (typeof data === 'string') {
        // Strip out dollar signs and dots that could be used in Mongoose query operators
        return data.replace(/[\$\.]/g, '');
    }
    if (Array.isArray(data)) {
        return data.map(item => sanitizeValue(item));
    }
    if (data !== null && typeof data === 'object') {
        const cleanObj = {};
        for (const key of Object.keys(data)) {
            // Remove leading $ or dots from key names
            const cleanKey = key.replace(/^[\$\.]+/, '');
            cleanObj[cleanKey] = sanitizeValue(data[key]);
        }
        return cleanObj;
    }
    return data;
};

// Express middleware to sanitize body, query, and params
export const mongoSanitize = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeValue(req.body);
    }
    if (req.query) {
        req.query = sanitizeValue(req.query);
    }
    if (req.params) {
        req.params = sanitizeValue(req.params);
    }
    next();
};

// Input validation middleware for admin login
export const validateAdminLogin = (req, res, next) => {
    const { username, password } = req.body || {};
    if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({ success: false, message: 'Valid username is required' });
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
        return res.status(400).json({ success: false, message: 'Valid password is required' });
    }
    next();
};

// Input validation middleware for change password
export const validateChangePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
        return res.status(400).json({ success: false, message: 'Current password is required' });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }
    next();
};

// Input validation middleware for customer register
export const validateCustomerRegister = (req, res, next) => {
    const { name, email, password, phone } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim() || phone.trim().length < 8) {
        return res.status(400).json({ success: false, message: 'Valid phone number is required' });
    }
    next();
};

// Input validation middleware for customer login
export const validateCustomerLogin = (req, res, next) => {
    const { email, password } = req.body || {};
    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }
    next();
};

// Input validation middleware for product creation/updates
export const validateProductInput = (req, res, next) => {
    if (req.method === 'POST') {
        const { name, price, category } = req.body || {};
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Product name is required' });
        }
        if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ success: false, message: 'Valid non-negative product price is required' });
        }
        if (!category || typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({ success: false, message: 'Product category is required' });
        }
    }
    next();
};

// Input validation middleware for order creation
export const validateOrderInput = (req, res, next) => {
    const { items, customer } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Order items must be a non-empty list' });
    }
    if (!customer || typeof customer !== 'object') {
        return res.status(400).json({ success: false, message: 'Customer details are required' });
    }
    const { name, phone, address } = customer;
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim() || phone.trim().length < 8) {
        return res.status(400).json({ success: false, message: 'Valid customer phone number is required' });
    }
    if (!address || typeof address !== 'string' || !address.trim()) {
        return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }
    next();
};
