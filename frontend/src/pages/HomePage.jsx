import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import Footer from '../components/Footer';
import LocationMapModal from '../components/LocationMapModal';
import { fetchProducts } from '../services/api';
import { categories } from '../data/categories';
import { ArrowUpRight, HeartHandshake, PackageCheck, ShieldCheck } from 'lucide-react';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [activeModalProduct, setActiveModalProduct] = useState(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setLoading(true);
            const featuredResult = await fetchProducts({ featured: true });
            let products = featuredResult?.success ? featuredResult.products || [] : [];
            let catalogResult = null;

            if (products.length < 6) {
                catalogResult = await fetchProducts();
                const seen = new Set(products.map((product) => product._id || product.id));
                const additionalProducts = (catalogResult?.products || []).filter((product) => {
                    const id = product._id || product.id;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });
                products = [...products, ...additionalProducts];
            }

            if (isMounted) {
                setFeaturedProducts(products.slice(0, 6));
                setLoadError(!featuredResult?.success && !catalogResult?.success);
                setLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false; };
    }, []);

    const scrollToCategories = () => {
        const el = document.getElementById('category-discovery');
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

    return (
        <div className="store-page">
            <Navbar />

            <HeroBanner
                products={featuredProducts.slice(0, 3)}
                onShopNowClick={scrollToCategories}
                onOpenMap={() => setIsMapModalOpen(true)}
            />

            <main className="container storefront-main">
                <section id="category-discovery" className="category-discovery" aria-labelledby="category-heading">
                    <div className="store-section-heading">
                        <div>
                            <span className="store-eyebrow">FIND YOUR FAVOURITES</span>
                            <h2 id="category-heading">Shop by category</h2>
                        </div>
                        <Link to="/products" className="store-text-link">Browse everything <ArrowUpRight size={17} /></Link>
                    </div>
                    <div className="category-card-grid">
                        {categories.map((category, index) => (
                            <Link
                                key={category.slug}
                                to={`/category/${category.slug}`}
                                className="category-card"
                                style={{ '--category-tone': category.tone }}
                            >
                                <span className="category-card-mark">{category.mark}</span>
                                <span className="category-card-copy">
                                    <span className="category-card-index">0{index + 1}</span>
                                    <strong>{category.name}</strong>
                                </span>
                                <ArrowUpRight size={17} className="category-card-arrow" />
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="featured-section" aria-labelledby="featured-heading">
                    <div className="store-section-heading">
                        <div>
                            <span className="store-eyebrow">FROM OUR ROHTAK COUNTER</span>
                            <h2 id="featured-heading">Featured products</h2>
                            <p>A small selection of real products from our catalog.</p>
                        </div>
                        <Link to="/products" className="store-text-link">View all products <ArrowUpRight size={17} /></Link>
                    </div>

                    {loading ? (
                        <div className="listing-state" role="status">Loading featured products...</div>
                    ) : loadError ? (
                        <div className="listing-state listing-state-error" role="alert">
                            Products could not be loaded. Please try again shortly.
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="listing-state">There are no featured products available right now.</div>
                    ) : (
                        <div className="store-product-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id || product.id}
                                    product={product}
                                    onViewDetails={setActiveModalProduct}
                                />
                            ))}
                        </div>
                    )}

                    <div className="featured-actions">
                        <Link to="/products" className="btn-secondary">See More Products</Link>
                    </div>
                </section>

                {/* Store Trust Features Banner */}
                <section className="store-benefits" aria-label="Shopping benefits">
                    <div className="store-benefit">
                        <div className="store-benefit-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                            <PackageCheck size={22} />
                        </div>
                        <div><h3>Fresh daily stock</h3><p>Prepared for crispness and authentic flavor.</p></div>
                    </div>
                    <div className="store-benefit">
                        <div className="store-benefit-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                            <HeartHandshake size={22} />
                        </div>
                        <div><h3>Rohtak local shop</h3><p>Visit us at Model Town Park, Rohtak.</p></div>
                    </div>
                    <div className="store-benefit">
                        <div className="store-benefit-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                            <ShieldCheck size={22} />
                        </div>
                        <div><h3>COD available</h3><p>Easy checkout and order tracking.</p></div>
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

        </div>
    );
};

export default HomePage;
