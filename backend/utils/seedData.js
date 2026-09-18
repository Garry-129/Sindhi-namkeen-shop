import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

dotenv.config();

export const initialProducts = [
    {
        name: 'Special Sindhi Mixture',
        category: 'Namkeen',
        price: 120,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
        description: 'Our flagship signature savory mix with roasted nuts, crispy sev, and authentic spices crafted in Rohtak.',
        isFeatured: true,
        rating: 4.9,
    },
    {
        name: 'Khatta Meetha Namkeen',
        category: 'Namkeen',
        price: 90,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 85,
        imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
        description: 'Perfect blend of sweet & tangy crunchy savory crisps. A tea-time favorite across Model Town.',
        isFeatured: true,
        rating: 4.8,
    },
    {
        name: 'Royal Bikaneri Bhujia',
        category: 'Namkeen',
        price: 100,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 90,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        description: 'Authentic crisp moth-bean bhujia seasoned with traditional Indian spices.',
        isFeatured: false,
        rating: 4.7,
    },
    {
        name: 'Crispy Masala Mathri',
        category: 'Namkeen',
        price: 85,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
        description: 'Flaky handmade savory crackers flavored with ajwain and black pepper.',
        isFeatured: false,
        rating: 4.6,
    },
    {
        name: 'Jumbo Roasted Kaju (Cashews)',
        category: 'Dry Fruits',
        price: 320,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1536591375315-1b836890327e?auto=format&fit=crop&w=800&q=80',
        description: 'Handpicked premium King-size roasted & lightly salted cashews.',
        isFeatured: true,
        rating: 5.0,
    },
    {
        name: 'California Jumbo Badam (Almonds)',
        category: 'Dry Fruits',
        price: 280,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1508061252966-170138985e50?auto=format&fit=crop&w=800&q=80',
        description: '100% natural, nutrient-dense crunchy California almonds.',
        isFeatured: true,
        rating: 4.9,
    },
    {
        name: 'Afghan Prime Anjeer (Figs)',
        category: 'Dry Fruits',
        price: 390,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
        description: 'Sun-dried soft and juicy natural Afghan figs rich in iron and fiber.',
        isFeatured: false,
        rating: 4.8,
    },
    {
        name: 'Roasted Salted Pistachios (Pista)',
        category: 'Dry Fruits',
        price: 350,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=800&q=80',
        description: 'Crispy in-shell roasted and lightly salted gourmet pistachios.',
        isFeatured: false,
        rating: 4.9,
    },
    {
        name: 'Sindhi Handmade Atta Desi Ghee Biscuits',
        category: 'Biscuits',
        price: 110,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 65,
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
        description: 'Traditional melt-in-mouth wheat flour bakery biscuits made with pure ghee.',
        isFeatured: true,
        rating: 4.9,
    },
    {
        name: 'Rich Kaju Pista Cookies',
        category: 'Biscuits',
        price: 140,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 55,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
        description: 'Loaded with real cashew and pistachio chunks. Crispy and rich in flavor.',
        isFeatured: false,
        rating: 4.8,
    },
    {
        name: 'Jeera Butter Crunchy Cookies',
        category: 'Biscuits',
        price: 95,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 70,
        imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        description: 'Salty & buttery cookies infused with roasted cumin seeds.',
        isFeatured: false,
        rating: 4.7,
    },
    {
        name: 'Peri Peri Roasted Makhana (Foxnuts)',
        category: 'Dry Fruits',
        price: 180,
        weightOptions: ['250g', '500g', '1kg'],
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=800&q=80',
        description: 'Healthy crunchy roasted foxnuts tossed in tangy zesty peri peri spice.',
        isFeatured: true,
        rating: 4.9,
    },
];

export const seedDatabase = async () => {
    try {
        const isConnected = await connectDB();
        if (!isConnected) {
            console.log('[Seed] Database not connected. Skipping DB seed.');
            return { success: false, message: 'DB not connected' };
        }

        await Product.deleteMany({});
        await Admin.deleteMany({});

        await Product.insertMany(initialProducts);

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        await Admin.create({
            username: adminUsername,
            password: adminPassword,
        });

        console.log('[Seed] Database seeded successfully!');
        console.log(`[Seed] Products created: ${initialProducts.length}`);
        console.log(`[Seed] Default Admin Created: Username: "${adminUsername}", Password: "${adminPassword}"`);

        return { success: true, count: initialProducts.length };
    } catch (error) {
        console.error('[Seed Error]:', error.message);
        return { success: false, error: error.message };
    }
};

// Run script if executed directly
if (process.argv[1]?.endsWith('seedData.js')) {
    seedDatabase().then(() => mongoose.connection.close());
}
