import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const importRealProducts = async () => {
    try {
        console.log('[Import] Connecting to MongoDB database...');
        const isConnected = await connectDB();
        if (!isConnected && mongoose.connection.readyState !== 1) {
            console.error('[Import Error] Database connection failed. Aborting import.');
            process.exit(1);
        }

        const dataPath = path.join(__dirname, '../data/products_import.json');
        console.log(`[Import] Reading product data from ${dataPath}...`);

        if (!fs.existsSync(dataPath)) {
            console.error(`[Import Error] File not found at ${dataPath}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const productsData = JSON.parse(rawData);

        if (!Array.isArray(productsData) || productsData.length === 0) {
            console.error('[Import Error] JSON file does not contain a valid non-empty array of products.');
            process.exit(1);
        }

        console.log(`[Import] Found ${productsData.length} products to import.`);

        // Clear only products collection, leaving orders, customers, and admin accounts untouched
        console.log('[Import] Clearing existing products from database...');
        await Product.deleteMany({});
        console.log('[Import] Existing products cleared.');

        // Insert new products
        console.log('[Import] Inserting new products into MongoDB...');
        const insertedProducts = await Product.insertMany(productsData);
        console.log(`[Import] Successfully inserted ${insertedProducts.length} products.`);

        // Calculate and log category breakdown summary
        const categoryCounts = {};
        insertedProducts.forEach((prod) => {
            const cat = prod.category || 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        console.log('\n========================================');
        console.log('       IMPORT SUMMARY REPORT            ');
        console.log('========================================');
        console.log(`Total Products Imported: ${insertedProducts.length}`);
        console.log('Breakdown by Category:');
        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count} products`);
        });
        console.log('========================================\n');

        return { success: true, total: insertedProducts.length, categoryCounts };
    } catch (error) {
        console.error('[Import Error]:', error.message || error);
        return { success: false, error: error.message };
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('[Import] Database connection closed.');
        }
    }
};

// Run directly when called from command line
if (process.argv[1]?.endsWith('importRealProducts.js')) {
    importRealProducts().then(() => process.exit(0));
}
