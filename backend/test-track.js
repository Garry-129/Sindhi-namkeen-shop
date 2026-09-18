import orderRoutes from './routes/orderRoutes.js';

console.log('Order routes loaded successfully!');
orderRoutes.stack.forEach(r => {
    if (r.route) {
        console.log(`Route: ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
    }
});
