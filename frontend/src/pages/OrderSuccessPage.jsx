import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin, MessageSquare, PhoneCall, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccessPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    useEffect(() => {
        if (order?.orderNumber) {
            try {
                const saved = JSON.parse(localStorage.getItem('sindhi_my_orders') || '[]');
                if (!saved.includes(order.orderNumber)) {
                    localStorage.setItem('sindhi_my_orders', JSON.stringify([order.orderNumber, ...saved].slice(0, 10)));
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [order]);

    const whatsappNumber = '+91 98XXXXXXXX';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', flexGrow: 1, maxWidth: '680px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-light)',
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                    }}>
                        <CheckCircle2 size={44} />
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Order Placed Successfully!
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Thank you for shopping with <strong>Sindhi Namkeen and Dry Fruits</strong>, Model Town Park, Rohtak.
                    </p>

                    {order && (
                        <div style={{
                            backgroundColor: 'var(--bg-muted)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.25rem',
                            textAlign: 'left',
                            marginBottom: '1.75rem',
                            border: '1px solid var(--border-light)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.4rem' }}>Order ID:</span>
                                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{order.orderNumber}</span>
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    backgroundColor: order.status === 'Cancelled' ? '#fee2e2' : 'var(--primary-light)',
                                    color: order.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)',
                                    border: `1px solid ${order.status === 'Cancelled' ? '#fca5a5' : 'var(--border-light)'}`,
                                }}>
                                    Status: {order.status || 'Pending'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                                <span style={{ fontWeight: 600 }}>{order.customer?.name}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
                                <span style={{ fontWeight: 600 }}>{order.customer?.phone}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
                                <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '240px' }}>{order.customer?.address}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
                                <span>Total Amount ({order.paymentMethod}):</span>
                                <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {order?.orderNumber && (
                            <Link to={`/track-order?orderNumber=${order.orderNumber}`} className="btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
                                <Truck size={18} />
                                <span>Track This Order</span>
                            </Link>
                        )}

                        <Link to="/" className="btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
                            <ShoppingBag size={18} />
                            <span>Continue Shopping</span>
                        </Link>

                        <a
                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                            style={{ padding: '0.75rem 1.4rem' }}
                        >
                            <MessageSquare size={18} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderSuccessPage;
