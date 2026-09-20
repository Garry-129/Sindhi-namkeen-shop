import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import MyOrdersPage from './pages/MyOrdersPage';
import MyAddressesPage from './pages/MyAddressesPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { useCart } from './context/CartContext';
import { CheckCircle2 } from 'lucide-react';

const ToastNotification = () => {
    const { toastMessage } = useCart();
    if (!toastMessage) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1d1714',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 999,
            fontSize: '0.9rem',
            fontWeight: 600,
            border: '1px solid var(--primary)',
            animation: 'fadeIn 0.3s ease',
        }}>
            <CheckCircle2 size={18} color="var(--primary)" />
            <span>{toastMessage}</span>
        </div>
    );
};

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/register" element={<CustomerRegister />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/my-addresses" element={<MyAddressesPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            <ToastNotification />
        </>
    );
};

export default App;
