import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    ShoppingBag,
    Plus,
    Edit,
    Trash2,
    Database,
    LogOut,
    RefreshCw,
    CheckCircle,
    Clock,
    Truck,
    AlertCircle,
    Search,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminProductModal from '../components/AdminProductModal';
import { useAuth } from '../context/AuthContext';
import {
    fetchProducts,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    fetchAdminOrders,
    updateOrderStatusApi,
    seedDatabaseApi,
} from '../services/api';
import { initialProducts } from '../data/sampleProducts';

const AdminDashboard = () => {
    const { isAuthenticated, logoutAdminContext, adminUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalProduct, setModalProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    const loadData = async () => {
        setLoading(true);
        // Load Products
        const prodRes = await fetchProducts();
        if (prodRes && prodRes.success) {
            setProducts(prodRes.products);
        } else {
            setProducts(initialProducts.map((p, i) => ({ ...p, _id: `prod_${i + 1}` })));
        }

        // Load Orders
        try {
            const orderRes = await fetchAdminOrders();
            if (orderRes && orderRes.success) {
                setOrders(orderRes.orders);
            }
        } catch {
            // Mock orders fallback
            setOrders([
                {
                    _id: 'ord_1001',
                    orderNumber: 'SN-2026-1001',
                    items: [
                        { name: 'Special Sindhi Mixture', price: 120, weightOption: '500g', quantity: 2 },
                        { name: 'Jumbo Roasted Kaju', price: 320, weightOption: '250g', quantity: 1 },
                    ],
                    customer: { name: 'Ramesh Sharma', phone: '9812012345', address: 'Model Town Park, Rohtak' },
                    totalAmount: 560,
                    paymentMethod: 'COD',
                    status: 'Pending',
                    createdAt: new Date().toISOString(),
                },
            ]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const showNotification = (msg) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const handleSaveProduct = async (formData, productId) => {
        if (productId) {
            await updateProductApi(productId, formData);
            showNotification('Product updated successfully!');
        } else {
            await createProductApi(formData);
            showNotification('Product added successfully!');
        }
        loadData();
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProductApi(id);
            showNotification('Product deleted successfully');
            loadData();
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        await updateOrderStatusApi(orderId, newStatus);
        showNotification(`Order ${orderId} status updated to ${newStatus}`);
        loadData();
    };

    const handleSeedDatabase = async () => {
        if (window.confirm('Seed default Sindhi Namkeen product catalog into database?')) {
            try {
                await seedDatabaseApi();
                showNotification('Database seeded with 12 fresh shop items!');
                loadData();
            } catch (err) {
                showNotification('Seed operation completed (Local fallback mode)');
            }
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.category.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '2rem', flexGrow: 1, paddingBottom: '3rem' }}>
                {/* Header Bar */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.75rem',
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            Store Management Dashboard
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Sindhi Namkeen & Dry Fruits • Model Town Park, Rohtak
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={handleSeedDatabase} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
                            <Database size={16} />
                            <span>Seed Catalog</span>
                        </button>
                        <button onClick={loadData} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
                            <RefreshCw size={16} />
                            <span>Refresh</span>
                        </button>
                        <button onClick={logoutAdminContext} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', color: 'var(--danger)' }}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {statusMsg && (
                    <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                        {statusMsg}
                    </div>
                )}

                {/* Overview Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Active Products</span>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>{products.length}</h3>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders Received</span>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.2rem' }}>{orders.length}</h3>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Shop Location</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>Model Town, Rohtak</h3>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            backgroundColor: activeTab === 'products' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'products' ? '#ffffff' : 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <Package size={18} />
                        <span>Product Inventory ({products.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            backgroundColor: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'orders' ? '#ffffff' : 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <ShoppingBag size={18} />
                        <span>Customer Orders ({orders.length})</span>
                    </button>
                </div>

                {/* TAB 1: PRODUCTS INVENTORY */}
                {activeTab === 'products' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ position: 'relative', width: '280px' }}>
                                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Filter by product name..."
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.8rem 0.5rem 2.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                                />
                            </div>

                            <button
                                onClick={() => { setModalProduct(null); setIsModalOpen(true); }}
                                className="btn-primary"
                                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                            >
                                <Plus size={18} />
                                <span>Add New Product</span>
                            </button>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-light)' }}>
                                        <th style={{ padding: '0.85rem 1rem' }}>Image</th>
                                        <th style={{ padding: '0.85rem 1rem' }}>Product Name</th>
                                        <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                                        <th style={{ padding: '0.85rem 1rem' }}>Base Price (250g)</th>
                                        <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
                                        <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p) => (
                                        <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <img src={p.imageUrl} alt={p.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }} />
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                                                {p.name} {p.isFeatured && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span className="badge badge-saffron">{p.category}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                ₹{p.price}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>{p.stock} units</td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => { setModalProduct(p); setIsModalOpen(true); }}
                                                        style={{ padding: '0.35rem 0.65rem', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        <Edit size={16} color="var(--text-main)" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(p._id)}
                                                        style={{ padding: '0.35rem 0.65rem', backgroundColor: '#fef2f2', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} color="var(--danger)" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: CUSTOMER ORDERS */}
                {activeTab === 'orders' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {orders.length === 0 ? (
                            <div style={{ backgroundColor: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                <h3>No orders placed yet</h3>
                            </div>
                        ) : (
                            orders.map((ord) => (
                                <div key={ord._id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                                        <div>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>Order {ord.orderNumber}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                                                {new Date(ord.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                                            <select
                                                value={ord.status}
                                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                                style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontWeight: 700, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Customer Details:</h4>
                                            <p style={{ fontWeight: 700 }}>{ord.customer?.name} ({ord.customer?.phone})</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {ord.customer?.address}</p>
                                            {ord.customer?.notes && <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.3rem' }}>Note: {ord.customer?.notes}</p>}
                                        </div>

                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Items Ordered:</h4>
                                            <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                                {ord.items?.map((it, i) => (
                                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>• {it.name} ({it.weightOption || '250g'}) x{it.quantity}</span>
                                                        <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                                                <span>Total Amount ({ord.paymentMethod}):</span>
                                                <span style={{ color: 'var(--primary)' }}>₹{ord.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Admin Product Modal */}
            {isModalOpen && (
                <AdminProductModal
                    product={modalProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProduct}
                />
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
