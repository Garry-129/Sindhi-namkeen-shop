import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle2, Truck, Package, XCircle, MapPin, Calendar, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { fetchCustomerOrdersApi } from '../services/api';

const STAGES = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Package },
];

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const { isCustomerAuthenticated, customerUser } = useCustomerAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isCustomerAuthenticated) {
            navigate('/login?redirect=my-orders');
            return;
        }

        const loadOrders = async () => {
            setLoading(true);
            try {
                const res = await fetchCustomerOrdersApi();
                if (res && res.success) {
                    setOrders(res.orders || []);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch your orders.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [isCustomerAuthenticated, navigate]);

    const getStageIndex = (status) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Confirmed': return 1;
            case 'Out for Delivery': return 2;
            case 'Delivered': return 3;
            default: return 0;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', flexGrow: 1, maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <ShoppingBag size={18} />
                        <span>Customer Portal</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        My Order History
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Hello {customerUser?.name || 'Customer'}, here are all your orders placed with Sindhi Namkeen.
                    </p>
                </div>

                {loading ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                        <Clock size={36} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '0.75rem' }} />
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', padding: '3.5rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <ShoppingBag size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No orders found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                            You haven't placed any orders yet. Browse our delicious snacks and dry fruits catalog to get started!
                        </p>
                        <Link to="/" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Explore Products</span>
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {orders.map((ord) => (
                            <div key={ord._id || ord.orderNumber} style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem',
                                border: '1px solid var(--border-light)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                {/* Order Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem',
                                    borderBottom: '1px solid var(--border-light)',
                                    paddingBottom: '1rem',
                                    marginBottom: '1.25rem',
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                Order #{ord.orderNumber}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} />
                                            <span>Placed on: {ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.82rem',
                                            fontWeight: 800,
                                            backgroundColor: ord.status === 'Cancelled' ? '#fee2e2' : 'var(--primary-light)',
                                            color: ord.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)',
                                            border: `1px solid ${ord.status === 'Cancelled' ? '#fca5a5' : 'var(--border-light)'}`,
                                        }}>
                                            {ord.status}
                                        </span>
                                        <Link
                                            to={`/track-order?orderNumber=${ord.orderNumber}`}
                                            style={{
                                                fontSize: '0.82rem',
                                                fontWeight: 700,
                                                color: 'var(--primary)',
                                                textDecoration: 'none',
                                                backgroundColor: 'var(--bg-muted)',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                            }}
                                        >
                                            <span>Live Track</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Stepper Mini Progress */}
                                {ord.status !== 'Cancelled' && (
                                    <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--bg-cream)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                                            {STAGES.map((stage, idx) => {
                                                const currentIdx = getStageIndex(ord.status);
                                                const isDone = idx <= currentIdx;
                                                const isCurrent = idx === currentIdx;
                                                return (
                                                    <div key={stage.key} style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 800 : (isDone ? 700 : 500), color: isDone ? 'var(--primary)' : 'var(--text-muted)' }}>
                                                        ● {stage.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Order Details & Items */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem' }} className="my-order-grid">
                                    <div>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            Delivery Address:
                                        </h4>
                                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>📍 {ord.customer?.address}</p>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📞 {ord.customer?.phone}</p>
                                    </div>

                                    <div>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                            Items ({ord.items?.length || 0}):
                                        </h4>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {ord.items?.map((it, i) => (
                                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>• {it.name} ({it.weightOption || '250g'}) x{it.quantity}</span>
                                                    <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem' }}>
                                            <span>Total ({ord.paymentMethod || 'COD'}):</span>
                                            <span style={{ color: 'var(--primary)' }}>₹{ord.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
        @media (max-width: 640px) {
          .my-order-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default MyOrdersPage;
