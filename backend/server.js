import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

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
