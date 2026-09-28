import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import Footer from '../components/Footer';
import LocationMapModal from '../components/LocationMapModal';
import { fetchProducts } from '../services/api';
import { initialProducts } from '../data/sampleProducts';
import { Sparkles, ShieldCheck, HeartHandshake, PackageCheck, AlertCircle } from 'lucide-react';

const getInitialProductLimit = (width) => {
    if (width <= 350) return 3;
    if (width <= 768) return 6;
    if (width <= 1024) return 9;
    return 12;
};

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeModalProduct, setActiveModalProduct] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const updateViewportWidth = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', updateViewportWidth);
        return () => window.removeEventListener('resize', updateViewportWidth);
    }, []);

    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setLoading(true);
            const res = await fetchProducts({ category: selectedCategory, search: searchTerm });
            if (isMounted) {
                if (res && res.success && res.products) {
                    setProducts(res.products);
                } else {
                    // Fallback to local static items if API isn't live yet
                    let filtered = initialProducts.map((p, idx) => ({ ...p, _id: `prod_${idx + 1}` }));
                    if (selectedCategory !== 'All') {
                        filtered = filtered.filter(p => p.category === selectedCategory);
                    }
                    if (searchTerm) {
                        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                    }
                    setProducts(filtered);
                }
                setLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false; };
    }, [selectedCategory, searchTerm]);

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setSearchParams(cat === 'All' ? {} : { category: cat });
    };

    const scrollToCatalog = () => {
        const el = document.getElementById('category-filter-section');
        if (el) {
            const navbarHeight = 80;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const initialProductLimit = getInitialProductLimit(viewportWidth);
    const gridProducts = products.slice(0, initialProductLimit);
    const remainingProducts = products.slice(initialProductLimit);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
            <Navbar />

            <HeroBanner
                onShopNowClick={scrollToCatalog}
                onOpenMap={() => setIsMapModalOpen(true)}
            />

            <main className="container main-catalog-container" id="catalog" style={{ paddingTop: '2rem', flexGrow: 1 }}>
                {/* Section Heading */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                    <span className="badge badge-saffron" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                        Handcrafted in Model Town Park, Rohtak
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        Explore Our {selectedCategory === 'All' ? 'Delicacies' : selectedCategory}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '500px', margin: '0.3rem auto 0 auto' }}>
                        Select your preferred pack option on any product card!
                    </p>
                </div>

                {/* Filter & Search Section */}
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* Product Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid var(--primary-light)',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem auto',
                        }} />
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading fresh items...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                        <AlertCircle size={38} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>No products found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <>
                        <div className="product-grid" style={{ marginBottom: remainingProducts.length ? '1.5rem' : '3rem' }}>
                            {gridProducts.map((prod) => (
                                <ProductCard
                                    key={prod._id || prod.id}
                                    product={prod}
                                    onViewDetails={(item) => setActiveModalProduct(item)}
                                />
                            ))}
                        </div>
                        {remainingProducts.length > 0 && (
                            <section className="product-rail-section" aria-label="More products">
                                <div className="product-rail-heading">
                                    <div>
                                        <h3>More to explore</h3>
                                        <p>{remainingProducts.length} more {remainingProducts.length === 1 ? 'product' : 'products'}</p>
                                    </div>
                                    <span className="product-rail-hint">Swipe or drag to browse</span>
                                </div>
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    grabCursor
                                    watchOverflow
                                    spaceBetween={12}
                                    slidesPerView={1.08}
                                    breakpoints={{
                                        351: { slidesPerView: 2.12, spaceBetween: 14 },
                                        769: { slidesPerView: 3.12, spaceBetween: 18 },
                                        1025: { slidesPerView: 4.12, spaceBetween: 20 },
                                    }}
                                    className="product-rail-swiper"
                                >
                                    {remainingProducts.map((prod) => (
                                        <SwiperSlide key={prod._id || prod.id}>
                                            <ProductCard
                                                product={prod}
                                                onViewDetails={(item) => setActiveModalProduct(item)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </section>
                        )}
                    </>
                )}

                {/* Store Trust Features Banner */}
                <section style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem',
                    textAlign: 'center',
                    marginTop: '2rem',
                }}>
                    <div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                            <PackageCheck size={22} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Fresh Daily Stock</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Prepared daily for crispiness & authentic flavor.</p>
                    </div>

                    <div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                            <HeartHandshake size={22} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Rohtak Local Shop</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Located centrally in Model Town Park, Rohtak.</p>
                    </div>

                    <div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                            <ShieldCheck size={22} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>COD & WhatsApp</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pay cash on delivery or order directly via WhatsApp.</p>
                    </div>
                </section>
            </main>

            {/* Product Detail Modal */}
            {activeModalProduct && (
                <ProductDetailModal
                    product={activeModalProduct}
                    onClose={() => setActiveModalProduct(null)}
                />
            )}

            {/* Location Map Popup Modal */}
            <LocationMapModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
            />

            <Footer />

            <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; }
          .main-catalog-container { padding-left: 0.85rem !important; padding-right: 0.85rem !important; }
        }
        @media (max-width: 350px) {
          .product-grid { grid-template-columns: 1fr; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default HomePage;
