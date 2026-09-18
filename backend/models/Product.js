import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Namkeen', 'Dry Fruits', 'Biscuits', 'Sweets & Snacks'],
            default: 'Namkeen',
        },
        price: {
            type: Number,
            required: [true, 'Base price is required'],
            min: 0,
        },
        weightOptions: {
            type: [String],
            default: ['250g', '500g', '1kg'],
        },
        stock: {
            type: Number,
            required: true,
            default: 50,
        },
        imageUrl: {
            type: String,
            default: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        },
        description: {
            type: String,
            default: 'Fresh & crunchy authentic delicacy from Sindhi Namkeen, Model Town Park, Rohtak.',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 4.8,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
