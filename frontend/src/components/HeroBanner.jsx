import React from 'react';
import { ShoppingCart, Sparkles, MapPin, Award, Truck, CheckCircle2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { initialProducts } from '../data/sampleProducts';

const heroSlides = [
    { product: initialProducts.find((product) => product.category === 'Namkeen'), label: 'Rohtak Favorite' },
    { product: initialProducts.find((product) => product.category === 'Dry Fruits'), label: 'Hand-picked Goodness' },
    { product: initialProducts.find((product) => product.category === 'Biscuits'), label: 'Made for Tea Time' },
].filter((slide) => slide.product);

const heroFallbackImage = heroSlides[0]?.product.imageUrl || '/images/products/placeholder.svg';

const HeroBanner = ({ onShopNowClick, onOpenMap }) => {
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
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            Model Town Park, Rohtak
                        </span>
                        <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                            Local Special
                        </span>
                        {onOpenMap && (
                            <button
                                onClick={onOpenMap}
                                type="button"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: 'var(--primary)',
                                    color: '#ffffff',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: '0.2rem',
                                    boxShadow: '0 2px 6px rgba(217, 83, 30, 0.25)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <MapPin size={12} />
                                <span>View on Map</span>
                            </button>
                        )}
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

                {/* Right Image Carousel */}
                <div className="hero-carousel-wrap">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        navigation
                        pagination={{ clickable: true }}
                        loop={heroSlides.length > 1}
                        speed={650}
                        grabCursor
                        className="hero-carousel-swiper"
                    >
                        {heroSlides.map(({ product, label }) => (
                            <SwiperSlide key={product._id || product.id || product.name}>
                                <div className="hero-carousel-slide">
                                    <img
                                        src={product.imageUrl || heroFallbackImage}
                                        alt={product.name}
                                        onError={(event) => {
                                            if (!event.currentTarget.dataset.fallbackApplied) {
                                                event.currentTarget.dataset.fallbackApplied = 'true';
                                                event.currentTarget.src = heroFallbackImage;
                                            }
                                        }}
                                    />
                                    <div className="hero-carousel-caption">
                                        <span className="badge badge-gold">{label}</span>
                                        <h3>{product.name}</h3>
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
