import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import Footer from '../components/Footer';
import { fetchProducts } from '../services/api';
import { initialProducts } from '../data/sampleProducts';
import { Sparkles, ShieldCheck, HeartHandshake, PackageCheck, AlertCircle } from 'lucide-react';

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeModalProduct, setActiveModalProduct] = useState(null);

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
        const el = document.getElementById('catalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <HeroBanner onShopNowClick={scrollToCatalog} />

            <main className="container" id="catalog" style={{ paddingTop: '2.5rem', flexGrow: 1 }}>
                {/* Section Heading */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <span className="badge badge-saffron" style={{ marginBottom: '0.4rem' }}>
                        Handcrafted in Model Town Park, Rohtak
                    </span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                        Explore Our {selectedCategory === 'All' ? 'Delicacies' : selectedCategory}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
                        Select your preferred pack weight (250g, 500g, 1kg) on any product card!
                    </p>
                </div>

                {/* Filter & Search */}
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
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                        <AlertCircle size={40} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>No products found</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search or category filter.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem',
                    }}>
                        {products.map((prod) => (
                            <ProductCard
                                key={prod._id}
                                product={prod}
                                onViewDetails={(item) => setActiveModalProduct(item)}
                            />
                        ))}
                    </div>
                )}

                {/* Store Trust Features Banner */}
                <section style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem 1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    textAlign: 'center',
                    marginTop: '2rem',
                }}>
                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <PackageCheck size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Fresh Daily Stock</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prepared daily for crispiness & authentic flavor.</p>
                    </div>

                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <HeartHandshake size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Rohtak Local Shop</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Located centrally in Model Town Park, Rohtak.</p>
                    </div>

                    <div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <ShieldCheck size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>COD & WhatsApp</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay cash on delivery or order directly via WhatsApp.</p>
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

            <Footer />

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default HomePage;
