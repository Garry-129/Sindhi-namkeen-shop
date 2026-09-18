import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, MessageSquare, CheckCircle, ArrowLeft, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../services/api';

const CheckoutPage = () => {
    const { cart, itemsSubtotal, deliveryCharge, grandTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        address: 'Model Town Park, Rohtak',
        notes: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'WhatsApp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const whatsappNumber = '+91 9138592984';
    const whatsappClean = whatsappNumber.replace(/[^0-9]/g, '');

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                    <h3>No items in cart to checkout</h3>
                    <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Return to Shop</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!customer.name || !customer.phone || !customer.address) {
            setError('Please fill in your Name, Phone Number, and Delivery Address');
            return;
        }

        setLoading(true);
        setError('');

        const orderPayload = {
            items: cart.map((i) => ({
                name: i.name,
                price: i.price,
                weightOption: i.weightOption,
                quantity: i.quantity,
                imageUrl: i.imageUrl,
            })),
            customer,
            itemsPrice: itemsSubtotal,
            deliveryCharge,
            totalAmount: grandTotal,
            paymentMethod,
        };

        try {
            let createdOrder = null;
            try {
                const res = await createOrderApi(orderPayload);
                if (res && res.success) {
                    createdOrder = res.order;
                }
            } catch (err) {
                console.warn('API call failed, fallback local order creation');
            }

            if (!createdOrder) {
                createdOrder = {
                    _id: `ord_${Date.now()}`,
                    orderNumber: `SN-${Date.now().toString().slice(-6)}`,
                    ...orderPayload,
                    status: 'Pending',
                    createdAt: new Date().toISOString(),
                };
            }

            // If WhatsApp method selected, generate and open formatted WhatsApp chat link!
            if (paymentMethod === 'WhatsApp') {
                const itemLines = cart.map(item => `• ${item.name} (${item.weightOption}) x${item.quantity} - ₹${item.price * item.quantity}`).join('%0A');
                const waText = `*NEW ORDER - Sindhi Namkeen & Dry Fruits*%0A%0A*Order ID:* ${createdOrder.orderNumber}%0A*Customer:* ${customer.name}%0A*Phone:* ${customer.phone}%0A*Delivery Address:* ${customer.address}%0A${customer.notes ? `*Notes:* ${customer.notes}%0A` : ''}%0A*Items:*%0A${itemLines}%0A%0A*Subtotal:* ₹${itemsSubtotal}%0A*Delivery Charge:* ₹${deliveryCharge}%0A*Grand Total:* ₹${grandTotal}%0A*Payment Mode:* Cash on Delivery via WhatsApp%0A%0APlease confirm my order!`;

                const waUrl = `https://wa.me/${whatsappClean}?text=${waText}`;
                window.open(waUrl, '_blank');
            }

            // Save order to localStorage for tracking
            try {
                const savedOrders = JSON.parse(localStorage.getItem('sindhi_my_orders') || '[]');
                if (!savedOrders.includes(createdOrder.orderNumber)) {
                    localStorage.setItem('sindhi_my_orders', JSON.stringify([createdOrder.orderNumber, ...savedOrders].slice(0, 10)));
                }
            } catch (err) {
                console.warn('Could not save order to localStorage', err);
            }

            clearCart();
            navigate('/order-success', { state: { order: createdOrder } });
        } catch (err) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2.5rem', flexGrow: 1, paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/cart" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ArrowLeft size={16} /> Return to Cart
                    </Link>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                    Delivery & Checkout
                </h2>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.85fr', gap: '2rem', alignItems: 'start' }} className="checkout-grid">
                    {/* Left: Customer Information & Delivery Address */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} color="var(--primary)" />
                            Recipient & Delivery Details
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rajesh Kumar"
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Phone / Mobile Number *</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="e.g. 98120 12345"
                                    value={customer.phone}
                                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Complete Delivery Address (Rohtak) *</label>
                                <textarea
                                    rows="3"
                                    required
                                    placeholder="House/Shop No., Street, Landmark, Model Town Park, Rohtak"
                                    value={customer.address}
                                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Special Instructions / Packing Notes (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Please send extra crisp mathri or call upon arrival"
                                    value={customer.notes}
                                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>
                        </div>

                        {/* Payment Mode Selection */}
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2rem', marginBottom: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                            Select Order & Payment Option
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div
                                onClick={() => setPaymentMethod('COD')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                    backgroundColor: paymentMethod === 'COD' ? 'var(--primary-light)' : '#ffffff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Cash on Delivery</span>
                                    <CheckCircle size={18} color={paymentMethod === 'COD' ? 'var(--primary)' : '#ccc'} />
                                </div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pay in cash when your fresh snacks arrive at your doorstep in Rohtak.</p>
                            </div>

                            <div
                                onClick={() => setPaymentMethod('WhatsApp')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: paymentMethod === 'WhatsApp' ? '2px solid #25d366' : '1px solid var(--border-light)',
                                    backgroundColor: paymentMethod === 'WhatsApp' ? '#f0fdf4' : '#ffffff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#15803d' }}>Order via WhatsApp</span>
                                    <MessageSquare size={18} color={paymentMethod === 'WhatsApp' ? '#25d366' : '#ccc'} />
                                </div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Opens WhatsApp with pre-filled order breakdown to send directly to shop ({whatsappNumber}).</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Box */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                            Order Breakdown ({cart.length} items)
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                            {cart.map((item) => (
                                <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <div>
                                        <span style={{ fontWeight: 700 }}>{item.name}</span>
                                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>{item.weightOption} x {item.quantity}</span>
                                    </div>
                                    <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>₹{itemsSubtotal}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                <span>Rohtak Delivery Fee</span>
                                <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : undefined, fontWeight: 700 }}>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </span>
                            </div>

                            <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                                <span>Grand Total</span>
                                <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={paymentMethod === 'WhatsApp' ? 'btn-whatsapp' : 'btn-primary'}
                            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', fontSize: '1rem' }}
                        >
                            {paymentMethod === 'WhatsApp' ? <MessageSquare size={18} /> : <ShieldCheck size={18} />}
                            <span>{loading ? 'Processing Order...' : paymentMethod === 'WhatsApp' ? 'Confirm Order on WhatsApp' : 'Place Cash on Delivery Order'}</span>
                        </button>
                    </div>
                </form>
            </main>

            <Footer />

            <style>{`
        @media (max-width: 850px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default CheckoutPage;
