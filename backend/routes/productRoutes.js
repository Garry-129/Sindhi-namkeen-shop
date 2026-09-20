import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { validateProductInput } from '../middleware/sanitize.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protectAdmin, validateProductInput, createProduct);
router.put('/:id', protectAdmin, validateProductInput, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
