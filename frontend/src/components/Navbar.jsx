import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, ShieldCheck, Menu, X, PhoneCall, Truck, User, LogOut, Package, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { categories } from '../data/categories';

const Navbar = () => {
    const { totalItemCount } = useCart();
    const { isAuthenticated: isAdminAuthenticated } = useAuth();
    const { isCustomerAuthenticated, customerUser, logoutCustomerContext } = useCustomerAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [seeMoreOpen, setSeeMoreOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const dropdownRef = useRef(null);
    const desktopMoreRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (desktopMoreRef.current && !desktopMoreRef.current.contains(event.target)) {
                setDesktopMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategoryClick = (category) => {
        setMobileMenuOpen(false);
        setDesktopMoreOpen(false);
        const selectedCategory = categories.find((item) => item.name === category);
        if (selectedCategory) navigate(`/category/${selectedCategory.slug}`);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const query = searchTerm.trim();
        navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
        setMobileMenuOpen(false);
    };

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Top Announcement Bar */}
            <div style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '100%', margin: '0 auto', whiteSpace: 'nowrap' }}>
                    <span>🎉 Fresh Handmade Namkeen & Gourmet Dry Fruits — Model Town Park, Rohtak!</span>
                    <span className="announcement-divider" style={{ opacity: 0.85 }}>•</span>
                    <span style={{ fontWeight: 700 }}>🚚 FREE Rohtak Delivery above ₹500!</span>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
                {/* Brand Logo & Name */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', minHeight: '44px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 10px rgba(217, 83, 30, 0.3)',
                        flexShrink: 0,
                    }}>
                        S
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.15, whiteSpace: 'nowrap' }} className="brand-title">
                            Sindhi Namkeen <span style={{ color: 'var(--primary)' }}>& Dry Fruits</span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '1px', whiteSpace: 'nowrap' }}>
                            <MapPin size={11} color="var(--primary)" />
                            <span>Model Town Park, Rohtak</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Category Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
                    <Link
                        to="/"
                        style={{
                            fontWeight: location.pathname === '/' && !location.search ? 700 : 500,
                            color: location.pathname === '/' && !location.search ? 'var(--primary)' : 'var(--text-main)',
                            minHeight: '44px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Home
                    </Link>

                    {/* Desktop "More ▾" Dropdown */}
                    <div style={{ position: 'relative' }} ref={desktopMoreRef}>
                        <button
                            onClick={() => setDesktopMoreOpen(!desktopMoreOpen)}
                            style={{
                                background: 'none',
                                font: 'inherit',
                                fontWeight: 600,
                                color: desktopMoreOpen ? 'var(--primary)' : 'var(--text-main)',
                                cursor: 'pointer',
                                minHeight: '44px',
                                padding: '0 0.25rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span>Shop categories</span>
                            <ChevronDown size={15} style={{ transform: desktopMoreOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                        </button>

                        {desktopMoreOpen && (
                            <div
                                className="animate-fade-in"
                                style={{
                                    position: 'absolute',
                                    top: '115%',
                                    left: 0,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-light)',
                                    minWidth: '160px',
                                    padding: '0.4rem 0',
                                    zIndex: 110,
                                }}
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category.slug}
                                        onClick={() => handleCategoryClick(category.name)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '0.65rem 1rem',
                                            fontSize: '0.88rem',
                                            color: 'var(--text-main)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                            transition: 'background-color 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                                            e.currentTarget.style.color = 'var(--primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-main)';
                                        }}
                                    >
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form className="nav-search" role="search" onSubmit={handleSearchSubmit}>
                        <Search size={18} aria-hidden="true" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search for products..."
                            aria-label="Search for products"
                        />
                        <button type="submit" aria-label="Search"><ArrowRight size={18} /></button>
                    </form>

                    <Link
                        to="/track-order"
                        style={{
                            fontWeight: location.pathname === '/track-order' ? 700 : 500,
                            color: location.pathname === '/track-order' ? 'var(--primary)' : 'var(--text-main)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            minHeight: '44px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Truck size={16} color="var(--primary)" />
                        <span>Track Order</span>
                    </Link>
                </nav>

                {/* Right Actions (Cart, Customer Account, Mobile Toggle) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <Link to="/search" className="mobile-search-trigger" aria-label="Search products" title="Search products">
                        <Search size={20} />
                    </Link>
                    {/* Customer Account Button */}
                    {isCustomerAuthenticated ? (
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-sm)',
                                    minHeight: '44px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={13} />
                                </div>
                                <span className="account-btn-text" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                                    zIndex: 110,
                                }}>
                                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{customerUser?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{customerUser?.email}</div>
                                    </div>

                                    <Link
                                        to="/my-orders"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, minHeight: '44px', whiteSpace: 'nowrap' }}
                                    >
                                        <Package size={16} color="var(--primary)" />
                                        <span>My Orders</span>
                                    </Link>

                                    <Link
                                        to="/my-addresses"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, minHeight: '44px', whiteSpace: 'nowrap' }}
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
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', fontSize: '0.88rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, borderTop: '1px solid var(--border-light)', marginTop: '0.25rem', minHeight: '44px', whiteSpace: 'nowrap' }}
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
                                gap: '0.35rem',
                                padding: '0.45rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: '#ffffff',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                minHeight: '44px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <User size={15} color="var(--primary)" />
                            <span className="signin-text">Sign In</span>
                        </Link>
                    )}

                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'transform 0.2s ease',
                            minHeight: '44px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <ShoppingBag size={18} />
                        <span className="cart-text">Cart</span>
                        {totalItemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                fontSize: '0.68rem',
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

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                        style={{
                            display: 'none',
                            background: 'none',
                            color: 'var(--text-main)',
                            minWidth: '44px',
                            minHeight: '44px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            marginLeft: '0.2rem',
                        }}
                        className="mobile-toggle"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Navigation */}
            {mobileMenuOpen && (
                <div
                    className="animate-fade-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid var(--border-light)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        maxHeight: 'calc(100vh - 80px)',
                        overflowY: 'auto',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    <button
                        onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                        style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.75rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => handleCategoryClick('Namkeen')}
                        style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.75rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                    >
                        🥨 Namkeen
                    </button>

                    <button
                        onClick={() => handleCategoryClick('Dry Fruits')}
                        style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.75rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                    >
                        🥜 Dry Fruits
                    </button>

                    <button
                        onClick={() => handleCategoryClick('Biscuits')}
                        style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.75rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                    >
                        🍪 Biscuits
                    </button>

                    {/* See More Collapsible Submenu */}
                    <div>
                        <button
                            onClick={() => setSeeMoreOpen(!seeMoreOpen)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'var(--bg-cream)',
                                border: '1px solid var(--border-light)',
                                font: 'inherit',
                                padding: '0.75rem 0.75rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                minHeight: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: 'var(--radius-sm)',
                                marginTop: '0.2rem',
                            }}
                        >
                            <span>See More Categories</span>
                            {seeMoreOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {seeMoreOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.75rem', paddingTop: '0.35rem', borderLeft: '2px solid var(--primary-light)', marginLeft: '0.5rem', marginTop: '0.35rem' }}>
                                <button
                                    onClick={() => handleCategoryClick('Mukhwas')}
                                    style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                                >
                                    🌿 Mukhwas
                                </button>
                                <button
                                    onClick={() => handleCategoryClick('Papad')}
                                    style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                                >
                                    🫓 Papad
                                </button>
                                <button
                                    onClick={() => handleCategoryClick('Achar')}
                                    style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                                >
                                    🫙 Achar
                                </button>
                                <button
                                    onClick={() => handleCategoryClick('Masala')}
                                    style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', width: '100%' }}
                                >
                                    🌶️ Masala
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => { navigate('/track-order'); setMobileMenuOpen(false); }}
                        style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', borderRadius: 'var(--radius-sm)', width: '100%', marginTop: '0.25rem' }}
                    >
                        <Truck size={18} />
                        <span>Track Order</span>
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        {isCustomerAuthenticated ? (
                            <>
                                <button onClick={() => { navigate('/my-orders'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', width: '100%' }}>
                                    <Package size={18} color="var(--primary)" />
                                    <span>My Orders</span>
                                </button>
                                <button onClick={() => { navigate('/my-addresses'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', width: '100%' }}>
                                    <MapPin size={18} color="var(--primary)" />
                                    <span>My Addresses</span>
                                </button>
                                <button onClick={() => { logoutCustomerContext(); setMobileMenuOpen(false); navigate('/'); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', width: '100%' }}>
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', font: 'inherit', padding: '0.65rem 0.5rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px', width: '100%' }}>
                                <User size={18} />
                                <span>Sign In / Create Account</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .store-nav-main { gap: 1rem; }
                .desktop-nav { gap: 0.85rem !important; flex: 1; justify-content: center; min-width: 0; }
                .nav-search {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    width: min(32vw, 360px);
                    min-width: 200px;
                    min-height: 44px;
                    padding: 0 0.45rem 0 0.85rem;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-full);
                    background: var(--bg-cream);
                    color: var(--text-muted);
                }
                .nav-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--text-main); }
                .nav-search input:focus { outline: none; }
                .nav-search button { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; color: #fff; background: var(--primary); border-radius: 50%; }
                .mobile-search-trigger { display: none; width: 42px; height: 42px; place-items: center; color: var(--text-main); border: 1px solid var(--border-light); border-radius: 50%; }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
                    .mobile-search-trigger { display: inline-grid; }
        }
        @media (max-width: 480px) {
          .nav-container { padding: 0.6rem 0.75rem !important; }
          .brand-title { font-size: 0.95rem !important; }
          .cart-text, .signin-text, .account-btn-text { display: none !important; }
          .announcement-divider { display: none !important; }
        }
      `}</style>
        </header>
    );
};

export default Navbar;
