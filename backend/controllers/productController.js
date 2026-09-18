import Product from '../models/Product.js';
import { initialProducts } from '../utils/seedData.js';

let fallbackProducts = [...initialProducts.map((item, idx) => ({
    ...item,
    _id: `prod_${idx + 1}`,
    createdAt: new Date().toISOString(),
}))];

// @desc    Get all products (with search & category filter)
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        const query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        let products;
        try {
            products = await Product.find(query).sort({ createdAt: -1 });
        } catch (dbErr) {
            console.warn('[Products Controller] Using fallback memory products');
            products = fallbackProducts.filter(p => {
                let match = true;
                if (category && category !== 'All') match = match && p.category === category;
                if (search) match = match && p.name.toLowerCase().includes(search.toLowerCase());
                if (featured === 'true') match = match && p.isFeatured;
                return match;
            });
        }

        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        let product;
        try {
            product = await Product.findById(id);
        } catch (err) {
            product = fallbackProducts.find(p => p._id === id);
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new product (Admin Protected)
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, category, price, weightOptions, stock, imageUrl, description, isFeatured } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
        }

        let newProduct;
        try {
            newProduct = await Product.create({
                name,
                category,
                price: Number(price),
                weightOptions: weightOptions && weightOptions.length > 0 ? weightOptions : ['250g', '500g', '1kg'],
                stock: Number(stock) || 50,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
                description: description || 'Fresh gourmet item from Sindhi Namkeen and Dry Fruits, Model Town Park, Rohtak.',
                isFeatured: Boolean(isFeatured),
            });
        } catch (err) {
            newProduct = {
                _id: `prod_${Date.now()}`,
                name,
                category,
                price: Number(price),
                weightOptions: weightOptions || ['250g', '500g', '1kg'],
                stock: Number(stock) || 50,
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
                description: description || 'Fresh item from Sindhi Namkeen, Rohtak',
                isFeatured: Boolean(isFeatured),
                rating: 5.0,
                createdAt: new Date().toISOString(),
            };
            fallbackProducts.unshift(newProduct);
        }

        res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update product (Admin Protected)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedProduct;

        try {
            updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        } catch (err) {
            const index = fallbackProducts.findIndex(p => p._id === id);
            if (index !== -1) {
                fallbackProducts[index] = { ...fallbackProducts[index], ...req.body };
                updatedProduct = fallbackProducts[index];
            }
        }

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete product (Admin Protected)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        try {
            await Product.findByIdAndDelete(id);
        } catch (err) {
            fallbackProducts = fallbackProducts.filter(p => p._id !== id);
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
