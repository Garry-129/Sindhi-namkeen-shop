import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Truck, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, itemsSubtotal, deliveryCharge, grandTotal } = useCart();
    const navigate = useNavigate();

    const amountForFreeDelivery = Math.max(0, 500 - itemsSubtotal);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2.5rem', flexGrow: 1, paddingBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ArrowLeft size={16} /> Back to Shop
                    </Link>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                    Your Shopping Cart
                </h2>

                {cart.length === 0 ? (
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-lg)',
                        padding: '4rem 1.5rem',
                        textAlign: 'center',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        <ShoppingBag size={56} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Looks like you haven't added any delicious Sindhi Namkeen or dry fruits yet.
                        </p>
                        <Link to="/" className="btn-primary">
                            Explore Our Products
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2rem', alignItems: 'start' }} className="cart-grid">
                        {/* Left: Cart Items List */}
                        <div>
                            {/* Free Delivery Bar Banner */}
                            <div style={{
                                backgroundColor: amountForFreeDelivery === 0 ? 'var(--primary-light)' : 'var(--secondary-light)',
                                border: amountForFreeDelivery === 0 ? '1px solid #fdba74' : '1px solid #fde68a',
                                padding: '0.85rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}>
                                <Truck size={22} color={amountForFreeDelivery === 0 ? 'var(--primary)' : '#d97706'} />
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {amountForFreeDelivery === 0 ? (
                                        <span style={{ color: 'var(--primary)' }}>🎉 Congratulations! You unlocked <strong>FREE Local Delivery</strong> in Rohtak!</span>
                                    ) : (
                                        <span style={{ color: '#92400e' }}>Add <strong>₹{amountForFreeDelivery}</strong> more to qualify for <strong>FREE Rohtak Delivery!</strong></span>
                                    )}
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-muted)' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Item Details</span>
                                    <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                                        Clear All
                                    </button>
                                </div>

                                {cart.map((item) => (
                                    <div
                                        key={item.cartItemId}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '1.25rem',
                                            borderBottom: '1px solid var(--border-light)',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'; }}
                                        />

                                        <div style={{ flexGrow: 1, minWidth: '160px' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{item.name}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>Pack: {item.weightOption}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price} each</span>
                                            </div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                                style={{ padding: '0.3rem 0.6rem', background: 'var(--bg-muted)', fontWeight: 800 }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ padding: '0.3rem 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                                style={{ padding: '0.3rem 0.6rem', background: 'var(--bg-muted)', fontWeight: 800 }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Total & Remove */}
                                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>
                                                ₹{item.price * item.quantity}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '0.2rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Summary Box */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            border: '1px solid var(--border-light)',
                            boxShadow: 'var(--shadow-sm)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                                Order Summary
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Items Subtotal</span>
                                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{itemsSubtotal}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Rohtak Local Delivery Fee</span>
                                    <span style={{ fontWeight: 700, color: deliveryCharge === 0 ? 'var(--success)' : 'var(--text-main)' }}>
                                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                    </span>
                                </div>

                                <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                                    <span>Grand Total</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary"
                                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={18} />
                            </button>

                            <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                📍 Direct delivery in <strong>Model Town Park, Rohtak</strong> & nearby areas. Cash on Delivery & WhatsApp order options available!
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
        @media (max-width: 850px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default CartPage;
