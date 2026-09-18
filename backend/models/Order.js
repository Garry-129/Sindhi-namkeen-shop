import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weightOption: { type: String, default: '250g' },
    quantity: { type: Number, required: true, default: 1 },
    imageUrl: { type: String },
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [orderItemSchema],
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            notes: { type: String, default: '' },
        },
        itemsPrice: { type: Number, required: true },
        deliveryCharge: { type: Number, required: true, default: 30 },
        totalAmount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ['COD', 'WhatsApp'],
            default: 'COD',
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
