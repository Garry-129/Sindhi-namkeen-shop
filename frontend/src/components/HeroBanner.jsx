import React from 'react';
import { ShoppingCart, Sparkles, MapPin, Award, Truck, CheckCircle2 } from 'lucide-react';

const HeroBanner = ({ onShopNowClick }) => {
    return (
        <section style={{
            background: 'linear-gradient(135deg, #fff7f2 0%, #fdf0e6 40%, #fae5d3 100%)',
            borderBottom: '1px solid var(--border-light)',
            padding: '3rem 0 3.5rem 0',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'center' }}>
                {/* Left Text Content */}
                <div className="animate-fade-in">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Model Town Park, Rohtak
                        </span>
                        <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                            Local Special
                        </span>
                    </div>

                    <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
                        Authentic Sindhi Namkeen & <span style={{ color: 'var(--primary)' }}>Gourmet Dry Fruits</span>
                    </h2>

                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.75rem', maxWidth: '540px' }}>
                        Handcrafted with love using traditional recipes right here in <strong>Model Town Park, Rohtak</strong>. Enjoy pure ghee biscuits, crunchy mixtures, and fresh hand-picked dry fruits.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <button onClick={onShopNowClick} className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}>
                            <ShoppingCart size={18} />
                            Shop Fresh Namkeen
                        </button>
                        <a href="#dry-fruits" onClick={onShopNowClick} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }}>
                            <Sparkles size={18} color="var(--secondary)" />
                            Browse Dry Fruits
                        </a>
                    </div>

                    {/* Highlights */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(217, 83, 30, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={18} color="var(--primary)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>100% Fresh & Authentic</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Truck size={18} color="var(--primary)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Same Day Rohtak Delivery</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={18} color="var(--primary)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hygienically Packed</span>
                        </div>
                    </div>
                </div>

                {/* Right Image Feature Card */}
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '420px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        border: '6px solid #ffffff',
                        background: '#ffffff',
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80"
                            alt="Sindhi Special Mixture"
                            style={{ width: '100%', height: '340px', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                            padding: '1.5rem 1.25rem 1.25rem 1.25rem',
                            color: '#ffffff',
                        }}>
                            <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>⭐ Best Seller</span>
                            <h3 style={{ color: '#ffffff', fontSize: '1.25rem' }}>Special Sindhi Mixture</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Rohtak's favorite crispy savory treat</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
};

export default HeroBanner;
