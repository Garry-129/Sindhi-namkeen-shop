import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, ShieldCheck, Menu, X, PhoneCall, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearchChange, searchTerm }) => {
    const { totalItemCount } = useCart();
    const { isAuthenticated, logoutAdminContext } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleCategoryClick = (category) => {
        navigate(`/?category=${category}`);
        setMobileMenuOpen(false);
    };

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Top Banner */}
            <div style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.35rem 1rem', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>🎉 Fresh Handmade Namkeen & Gourmet Dry Fruits Direct From Model Town Park, Rohtak!</span>
                    <span style={{ opacity: 0.85 }}>•</span>
                    <span>🚚 FREE Rohtak Local Delivery on orders above ₹500!</span>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
                {/* Brand Logo & Name */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        boxShadow: '0 4px 10px rgba(217, 83, 30, 0.3)',
                    }}>
                        S
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Sindhi Namkeen <span style={{ color: 'var(--primary)' }}>& Dry Fruits</span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                            <MapPin size={12} color="var(--primary)" />
                            <span>Model Town Park, Rohtak</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Category Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
                    <Link to="/" style={{ fontWeight: location.pathname === '/' ? 700 : 500, color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)' }}>
                        Home
                    </Link>
                    <button onClick={() => handleCategoryClick('Namkeen')} style={{ background: 'none', font: 'inherit', fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer' }}>
                        Namkeen
                    </button>
                    <button onClick={() => handleCategoryClick('Dry Fruits')} style={{ background: 'none', font: 'inherit', fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer' }}>
                        Dry Fruits
                    </button>
                    <button onClick={() => handleCategoryClick('Biscuits')} style={{ background: 'none', font: 'inherit', fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer' }}>
                        Biscuits
                    </button>
                    <Link to="/track-order" style={{ fontWeight: location.pathname === '/track-order' ? 700 : 500, color: location.pathname === '/track-order' ? 'var(--primary)' : 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Truck size={16} color="var(--primary)" />
                        <span>Track Order</span>
                    </Link>
                </nav>

                {/* Right Actions (Cart, Admin link) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                        to="/cart"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <ShoppingBag size={20} />
                        <span>Cart</span>
                        {totalItemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #ffffff',
                            }}>
                                {totalItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: 'none', background: 'none', color: 'var(--text-main)' }}
                        className="mobile-toggle"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 600 }}>Home</button>
                    <button onClick={() => handleCategoryClick('Namkeen')} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 600 }}>Namkeen</button>
                    <button onClick={() => handleCategoryClick('Dry Fruits')} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 600 }}>Dry Fruits</button>
                    <button onClick={() => handleCategoryClick('Biscuits')} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 600 }}>Biscuits</button>
                    <button onClick={() => { navigate('/track-order'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={18} />
                        <span>Track Order</span>
                    </button>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </header>
    );
};

export default Navbar;
