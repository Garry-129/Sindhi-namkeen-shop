import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const shopPhone = '+91 9138592984';
    const whatsappNumber = '+91 9138592984';
    const whatsappClean = whatsappNumber.replace(/[^0-9]/g, '');

    return (
        <footer style={{
            backgroundColor: '#1d1714',
            color: '#f3ece7',
            paddingTop: '3.5rem',
            paddingBottom: '2rem',
            marginTop: '4rem',
            borderTop: '4px solid var(--primary)',
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem',
                }}>
                    {/* Column 1: Shop Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1.2rem',
                            }}>
                                S
                            </div>
                            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                                Sindhi Namkeen <span style={{ color: 'var(--primary)' }}>& Dry Fruits</span>
                            </h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#b5a59c', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                            Rohtak's premier store for authentic handcrafted namkeen, pure ghee biscuits, and premium quality dry fruits.
                        </p>
                        <a
                            href={`https://wa.me/${whatsappClean}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                        >
                            <MessageSquare size={16} />
                            <span>Order via WhatsApp</span>
                        </a>
                    </div>

                    {/* Column 2: Store Location & Address */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.25rem', position: 'relative' }}>
                            Store Location
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#d4c6bc' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                                <span>Model Town Park, Rohtak, Haryana 124001</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <span>Call Us: <strong>{shopPhone}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Clock size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <span>Open Daily: 9:00 AM – 9:30 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.25rem' }}>
                            Categories & Links
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#d4c6bc' }}>
                            <li><Link to="/?category=Namkeen" style={{ hover: { color: 'var(--primary)' } }}>🥨 Special Namkeen</Link></li>
                            <li><Link to="/?category=Dry Fruits">🥜 Gourmet Dry Fruits</Link></li>
                            <li><Link to="/?category=Biscuits">🍪 Bakery Biscuits</Link></li>
                            <li><Link to="/cart">🛒 View Shopping Cart</Link></li>
                            <li><Link to="/admin/login" style={{ color: '#88766c', fontSize: '0.8rem' }}>🔒 Admin Portal Login</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Delivery Promise */}
                    <div>
                        <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.25rem' }}>
                            Delivery Promise
                        </h4>
                        <div style={{ backgroundColor: '#28201b', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #3d3129' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.4rem' }}>
                                🚚 Rohtak Local Express Delivery
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#b5a59c', lineHeight: 1.5 }}>
                                Free delivery on orders above <strong>₹500</strong>. Flat ₹30 delivery charge for smaller local orders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid #342a24',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.82rem',
                    color: '#8e7e74',
                }}>
                    <div>
                        © 2026 <strong>Sindhi Namkeen and Dry Fruits</strong>. All rights reserved. Model Town Park, Rohtak.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        Made with <Heart size={14} color="var(--primary)" fill="var(--primary)" /> for local food lovers
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
