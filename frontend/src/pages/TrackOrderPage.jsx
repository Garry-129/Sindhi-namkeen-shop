import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, XCircle, MapPin, Phone, User, Calendar, CreditCard, ShoppingBag, AlertCircle, ArrowLeft, History } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { trackOrderApi } from '../services/api';

const STAGES = [
    { key: 'Pending', label: 'Order Placed', icon: Clock, desc: 'We have received your order' },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Shop is preparing fresh items' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'Delivery partner on the way' },
    { key: 'Delivered', label: 'Delivered', icon: Package, desc: 'Order delivered to your doorstep' },
];

const TrackOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const orderNumFromUrl = searchParams.get('orderNumber') || '';
    const phoneFromUrl = searchParams.get('phone') || '';

    const [searchInput, setSearchInput] = useState(orderNumFromUrl || phoneFromUrl || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ordersResult, setOrdersResult] = useState([]);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);

    // Load recent orders from localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('sindhi_my_orders') || '[]');
            setRecentOrders(saved);
        } catch (e) {
            console.error('Error reading recent orders from localStorage', e);
        }
    }, []);

    // Perform tracking query
    const handleTrack = async (queryValue) => {
        const query = (queryValue !== undefined ? queryValue : searchInput).trim();
        if (!query) {
            setError('Please enter an Order Number or Phone Number.');
            return;
        }

        setLoading(true);
        setError('');
        setOrdersResult([]);

        const isPhone = /^[0-9+\s-]{7,15}$/.test(query) && !query.toUpperCase().startsWith('SN');

        try {
            const payload = isPhone ? { phone: query } : { orderNumber: query };
            const res = await trackOrderApi(payload);

            if (res && res.success) {
                if (res.order) {
                    setOrdersResult([res.order]);
                } else if (res.orders && res.orders.length > 0) {
                    setOrdersResult(res.orders);
                } else {
                    setError('No order found matching your search.');
                }
                setSelectedOrderIndex(0);

                // Update URL search param for shareable link
                if (isPhone) {
                    setSearchParams({ phone: query });
                } else {
                    setSearchParams({ orderNumber: query });
                }
            } else {
                setError(res?.message || 'No matching order found.');
            }
        } catch (err) {
            setError(err.message || err.error || 'Unable to fetch order status. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    // Trigger initial search if URL query present
    useEffect(() => {
        const initial = orderNumFromUrl || phoneFromUrl;
        if (initial) {
            setSearchInput(initial);
            handleTrack(initial);
        }
    }, [orderNumFromUrl, phoneFromUrl]);

    const activeOrder = ordersResult[selectedOrderIndex] || null;

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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', flexGrow: 1, maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        marginBottom: '0.75rem',
                    }}>
                        <Truck size={16} />
                        <span>Live Order Tracking</span>
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        Track Your Order Status
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto' }}>
                        Enter your Order Number (e.g. SN-XXXXXX) or your registered Phone Number to check real-time order status.
                    </p>
                </div>

                {/* Recent Orders Pills */}
                {recentOrders.length > 0 && (
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.5rem',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                            <History size={16} color="var(--primary)" />
                            <span>Your Recent Orders (This Device):</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {recentOrders.map((ordNum) => (
                                <button
                                    key={ordNum}
                                    onClick={() => {
                                        setSearchInput(ordNum);
                                        handleTrack(ordNum);
                                    }}
                                    style={{
                                        padding: '0.4rem 0.85rem',
                                        borderRadius: 'var(--radius-full)',
                                        border: searchInput === ordNum ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                                        backgroundColor: searchInput === ordNum ? 'var(--primary-light)' : 'var(--bg-muted)',
                                        color: searchInput === ordNum ? 'var(--primary)' : 'var(--text-main)',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {ordNum}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Form Box */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '2rem',
                }}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleTrack();
                        }}
                        style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
                    >
                        <div style={{ flexGrow: 1, position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Enter Order Number (e.g. SN-1001) or Mobile Number"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-light)',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'var(--bg-cream)',
                                }}
                            />
                            <Search
                                size={20}
                                color="var(--text-muted)"
                                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', whiteSpace: 'nowrap' }}
                        >
                            {loading ? 'Searching...' : 'Track Status'}
                        </button>
                    </form>

                    {error && (
                        <div style={{
                            marginTop: '1.25rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.9rem',
                        }}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Multiple Orders Selector tabs if search returned multiple orders by phone */}
                {ordersResult.length > 1 && (
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Found {ordersResult.length} orders:</span>
                        {ordersResult.map((ord, idx) => (
                            <button
                                key={ord.orderNumber || idx}
                                onClick={() => setSelectedOrderIndex(idx)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: selectedOrderIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                    backgroundColor: selectedOrderIndex === idx ? 'var(--primary-light)' : '#ffffff',
                                    color: selectedOrderIndex === idx ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                }}
                            >
                                {ord.orderNumber} ({ord.status})
                            </button>
                        ))}
                    </div>
                )}

                {/* Active Order Breakdown */}
                {activeOrder && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Order Header Summary */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.75rem',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-light)',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                borderBottom: '1px solid var(--border-light)',
                                paddingBottom: '1.25rem',
                                marginBottom: '1.5rem',
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                            Order #{activeOrder.orderNumber}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        <span>Placed on: {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently'}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.4rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        backgroundColor: activeOrder.status === 'Cancelled' ? '#fee2e2' : 'var(--primary-light)',
                                        color: activeOrder.status === 'Cancelled' ? 'var(--danger)' : 'var(--primary)',
                                        border: `1px solid ${activeOrder.status === 'Cancelled' ? '#fca5a5' : 'var(--border-light)'}`,
                                    }}>
                                        Status: {activeOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stepper Timeline */}
                            {activeOrder.status === 'Cancelled' ? (
                                <div style={{
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    color: '#b91c1c',
                                }}>
                                    <XCircle size={32} />
                                    <div>
                                        <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>Order Cancelled</h4>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                            This order was cancelled by the store or customer. If you have questions, please contact Sindhi Namkeen support.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '0.5rem 0' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }} className="timeline-grid">
                                        {STAGES.map((stage, idx) => {
                                            const currentIdx = getStageIndex(activeOrder.status);
                                            const isDone = idx <= currentIdx;
                                            const isCurrent = idx === currentIdx;
                                            const Icon = stage.icon;

                                            return (
                                                <div
                                                    key={stage.key}
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        position: 'relative',
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '46px',
                                                        height: '46px',
                                                        borderRadius: '50%',
                                                        backgroundColor: isDone ? (isCurrent ? 'var(--primary)' : '#16a34a') : 'var(--bg-muted)',
                                                        color: isDone ? '#ffffff' : 'var(--text-muted)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none',
                                                        transition: 'all 0.3s ease',
                                                        marginBottom: '0.6rem',
                                                    }}>
                                                        <Icon size={22} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: isCurrent ? 800 : (isDone ? 700 : 500),
                                                        color: isDone ? 'var(--text-main)' : 'var(--text-muted)',
                                                        marginBottom: '0.2rem',
                                                    }}>
                                                        {stage.label}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: '140px' }}>
                                                        {stage.desc}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Two Columns: Customer Details & Order Items */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="details-grid">
                            {/* Delivery & Customer Info */}
                            <div style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border-light)',
                            }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    Delivery Details
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <User size={16} color="var(--text-muted)" />
                                        <span style={{ fontWeight: 700 }}>{activeOrder.customer?.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Phone size={16} color="var(--text-muted)" />
                                        <span>{activeOrder.customer?.phone}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                        <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <span style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{activeOrder.customer?.address}</span>
                                    </div>
                                    {activeOrder.customer?.notes && (
                                        <div style={{ backgroundColor: 'var(--bg-muted)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                                            <strong>Note:</strong> {activeOrder.customer.notes}
                                        </div>
                                    )}

                                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <CreditCard size={16} color="var(--primary)" />
                                        <span>Payment Mode: <strong>{activeOrder.paymentMethod || 'COD'}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Items & Payment Breakdown */}
                            <div style={{
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--radius-lg)',
                                padding: '1.5rem',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--border-light)',
                            }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShoppingBag size={18} color="var(--primary)" />
                                    Order Items ({activeOrder.items?.length || 0})
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                    {activeOrder.items?.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                {item.imageUrl && (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div>
                                                    <span style={{ fontWeight: 700, display: 'block' }}>{item.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.weightOption} x {item.quantity}</span>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>Subtotal</span>
                                        <span>₹{activeOrder.itemsPrice}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                        <span>Delivery Fee</span>
                                        <span style={{ fontWeight: 700, color: activeOrder.deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                                            {activeOrder.deliveryCharge === 0 ? 'FREE' : `₹${activeOrder.deliveryCharge}`}
                                        </span>
                                    </div>
                                    <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                                        <span>Total Amount</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{activeOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
        @media (max-width: 768px) {
          .timeline-grid { grid-template-columns: 1fr 1fr !important; gap: 1.25rem !important; }
          .details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default TrackOrderPage;
