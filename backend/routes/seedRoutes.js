import express from 'express';
import { seedDatabase } from '../utils/seedData.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const result = await seedDatabase();
    if (result.success) {
        res.json({ success: true, message: 'Database seeded successfully', count: result.count });
    } else {
        res.status(500).json({ success: false, message: result.error || result.message });
    }
});

export default router;
