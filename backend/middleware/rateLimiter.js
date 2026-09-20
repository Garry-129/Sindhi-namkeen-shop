import rateLimit from 'express-rate-limit';

// Rate limiter for admin login: max 5 failed attempts per IP per 15 minutes
export const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true, // Only count failed attempts towards the limit
    statusCode: 429,
    message: {
        success: false,
        message: 'Too many attempts, please try again in 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for customer login and registration
export const customerAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    skipSuccessfulRequests: true,
    statusCode: 429,
    message: {
        success: false,
        message: 'Too many attempts, please try again in 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limiter for public routes (e.g. order tracking): max 100 requests per 15 minutes
export const generalPublicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    statusCode: 429,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
