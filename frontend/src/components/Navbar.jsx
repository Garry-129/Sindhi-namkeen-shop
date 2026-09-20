import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, ShieldCheck, Menu, X, PhoneCall, Truck, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = ({ onSearchChange, searchTerm }) => {
    const { totalItemCount } = useCart();
    const { isAuthenticated: isAdminAuthenticated } = useAuth();
    const { isCustomerAuthenticated, customerUser, logoutCustomerContext } = useCustomerAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                {/* Right Actions (Cart, Customer Account, Admin link) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {/* Customer Account Button / Dropdown */}
                    {isCustomerAuthenticated ? (
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 0.95rem',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-sm)',
                                }}
                            >
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={14} />
                                </div>
                                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {customerUser?.name?.split(' ')[0] || 'Account'}
                                </span>
                                <ChevronDown size={14} color="var(--text-muted)" />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '115%',
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-light)',
                                    minWidth: '180px',
                                    padding: '0.5rem 0',
                                    zIndex: 10,
                                }}>
                                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>{customerUser?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customerUser?.email}</div>
                                    </div>

                                    <Link
                                        to="/my-orders"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}
                                    >
                                        <Package size={16} color="var(--primary)" />
                                        <span>My Orders</span>
                                    </Link>

                                    <Link
                                        to="/my-addresses"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}
                                    >
                                        <MapPin size={16} color="var(--primary)" />
                                        <span>My Addresses</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logoutCustomerContext();
                                            setDropdownOpen(false);
                                            navigate('/');
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, borderTop: '1px solid var(--border-light)', marginTop: '0.25rem' }}
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.55rem 0.95rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: '#ffffff',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <User size={16} color="var(--primary)" />
                            <span>Sign In</span>
                        </Link>
                    )}

                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.55rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <ShoppingBag size={18} />
                        <span>Cart</span>
                        {totalItemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
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

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                        {isCustomerAuthenticated ? (
                            <>
                                <button onClick={() => { navigate('/my-orders'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={18} color="var(--primary)" />
                                    <span>My Orders</span>
                                </button>
                                <button onClick={() => { navigate('/my-addresses'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    <span>My Addresses</span>
                                </button>
                                <button onClick={() => { logoutCustomerContext(); setMobileMenuOpen(false); navigate('/'); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.5rem 0', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} />
                                <span>Sign In / Create Account</span>
                            </button>
                        )}
                    </div>
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
