import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import { mongoSanitize } from './middleware/sanitize.js';
import { generalPublicLimiter } from './middleware/rateLimiter.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();

// Set HTTP Security Headers via Helmet
app.use(helmet());

// CORS restriction: Allow only official Vercel frontend URL in production & local dev origins
const allowedOrigins = [
    'https://sindhi-namkeen-shop.vercel.app',
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server) or matching allowed origins
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('CORS policy does not allow access from this origin'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// Prevent NoSQL injection by sanitizing inputs
app.use(mongoSanitize);

// API Base status route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        shop: 'Sindhi Namkeen and Dry Fruits',
        location: 'Model Town Park, Rohtak',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/seed', seedRoutes);

// Fallback for unknown API routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

// Connect database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`===========================================================`);
        console.log(` Sindhi Namkeen & Dry Fruits Backend API Server Running `);
        console.log(` Location: Model Town Park, Rohtak `);
        console.log(` URL: http://localhost:${PORT}/api/health `);
        console.log(`===========================================================`);
    });
});
