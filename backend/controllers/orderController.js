import Order from '../models/Order.js';

let fallbackOrders = [
    {
        _id: 'ord_1001',
        orderNumber: 'SN-2026-1001',
        items: [
            { name: 'Special Sindhi Mixture', price: 120, weightOption: '500g', quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80' },
            { name: 'Jumbo Roasted Kaju (Cashews)', price: 320, weightOption: '250g', quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1536591375315-1b836890327e?auto=format&fit=crop&w=800&q=80' },
        ],
        customer: {
            name: 'Ramesh Sharma',
            phone: '9812012345',
            address: 'House #142, Near Model Town Park, Rohtak',
            notes: 'Please pack in eco-friendly bags.',
        },
        itemsPrice: 560,
        deliveryCharge: 0,
        totalAmount: 560,
        paymentMethod: 'COD',
        status: 'Pending',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    }
];

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const { items, customer, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
        }

        if (!customer || !customer.name || !customer.phone || !customer.address) {
            return res.status(400).json({ success: false, message: 'Customer name, phone, and delivery address are required' });
        }

        const itemsPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const deliveryCharge = itemsPrice >= 500 ? 0 : 30;
        const totalAmount = itemsPrice + deliveryCharge;
        const orderNumber = `SN-${Date.now().toString().slice(-6)}`;

        const customerId = req.body.customerId || req.body.customer?.customerId || null;

        let newOrder;
        try {
            newOrder = await Order.create({
                orderNumber,
                customerId,
                items,
                customer,
                itemsPrice,
                deliveryCharge,
                totalAmount,
                paymentMethod: paymentMethod || 'COD',
                status: 'Pending',
            });
        } catch (err) {
            newOrder = {
                _id: `ord_${Date.now()}`,
                orderNumber,
                customerId,
                items,
                customer,
                itemsPrice,
                deliveryCharge,
                totalAmount,
                paymentMethod: paymentMethod || 'COD',
                status: 'Pending',
                createdAt: new Date().toISOString(),
            };
            fallbackOrders.unshift(newOrder);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders (Admin Protected)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
    try {
        let orders;
        try {
            orders = await Order.find({}).sort({ createdAt: -1 });
        } catch (dbErr) {
            orders = fallbackOrders;
        }

        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (Admin Protected)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        let updatedOrder;
        try {
            updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        } catch (err) {
            const orderIndex = fallbackOrders.findIndex(o => o._id === id || o.orderNumber === id);
            if (orderIndex !== -1) {
                fallbackOrders[orderIndex].status = status;
                updatedOrder = fallbackOrders[orderIndex];
            }
        }

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: `Order status updated to ${status}`, order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Track order by orderNumber or phone (Public)
// @route   GET /api/orders/track/:orderNumber
// @route   GET /api/orders/track
export const trackOrder = async (req, res) => {
    try {
        const orderNumberParam = req.params.orderNumber || req.query.orderNumber;
        const phoneParam = req.query.phone;

        if (!orderNumberParam && !phoneParam) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an Order Number or Phone Number to track order.'
            });
        }

        const sanitizeOrder = (ord) => ({
            _id: ord._id,
            orderNumber: ord.orderNumber,
            items: ord.items,
            customer: {
                name: ord.customer?.name,
                phone: ord.customer?.phone,
                address: ord.customer?.address,
                notes: ord.customer?.notes || '',
            },
            itemsPrice: ord.itemsPrice,
            deliveryCharge: ord.deliveryCharge,
            totalAmount: ord.totalAmount,
            paymentMethod: ord.paymentMethod,
            status: ord.status,
            createdAt: ord.createdAt,
        });

        if (orderNumberParam) {
            const cleanOrderNum = orderNumberParam.trim();
            const order = await Order.findOne({ orderNumber: cleanOrderNum }).lean();

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `No order found with Order Number "${cleanOrderNum}"`
                });
            }

            return res.json({
                success: true,
                order: sanitizeOrder(order)
            });
        }

        if (phoneParam) {
            const cleanPhone = phoneParam.trim();
            const orders = await Order.find({ 'customer.phone': { $regex: cleanPhone, $options: 'i' } })
                .sort({ createdAt: -1 })
                .lean();

            if (!orders || orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No orders found for phone number "${cleanPhone}"`
                });
            }

            return res.json({
                success: true,
                count: orders.length,
                orders: orders.map(sanitizeOrder)
            });
        }
    } catch (error) {
        console.error('Track order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch order right now, please try again'
        });
    }
};


