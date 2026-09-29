import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, ChevronRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { categories, getCategoryBySlug } from '../data/categories';
import { fetchProducts } from '../services/api';

const DESKTOP_PAGE_SIZE = 30;
const MOBILE_PAGE_SIZE = 14;

const getPaginationItems = (currentPage, pageCount) => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);

    const nearbyPages = currentPage <= 2
        ? [1, 2, 3]
        : currentPage >= pageCount - 1
            ? [pageCount - 2, pageCount - 1, pageCount]
            : [currentPage - 1, currentPage, currentPage + 1];
    const pages = [...new Set([1, ...nearbyPages, pageCount])].sort((left, right) => left - right);
    const items = [];

    pages.forEach((page, index) => {
        if (index > 0) {
            const gap = page - pages[index - 1];
            if (gap === 2) items.push(page - 1);
            else if (gap > 2) items.push(`ellipsis-${pages[index - 1]}-${page}`);
        }
        items.push(page);
    });

    return items;
};

const ProductListingPage = ({ mode }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const requestedPage = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const category = mode === 'category' ? getCategoryBySlug(slug) : null;
    const [searchInput, setSearchInput] = useState(query);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeModalProduct, setActiveModalProduct] = useState(null);
    const [pageSize, setPageSize] = useState(() => (
        window.matchMedia('(max-width: 600px)').matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE
    ));

    useEffect(() => {
        const mobileViewport = window.matchMedia('(max-width: 600px)');
        const updatePageSize = () => {
            setPageSize(mobileViewport.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
        };

        mobileViewport.addEventListener('change', updatePageSize);
        return () => mobileViewport.removeEventListener('change', updatePageSize);
    }, []);

    useEffect(() => {
        setSearchInput(query);
    }, [query]);

    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setLoading(true);
            setError(false);
            if (mode === 'category' && !category) {
                setProducts([]);
                setLoading(false);
                return;
            }

            const params = {};
            if (category) params.category = category.name;
            if (query.trim()) params.search = query.trim().replace(/\bkajoo\b/gi, 'kaju');
            const result = await fetchProducts(params);

            if (!isMounted) return;
            if (result?.success && Array.isArray(result.products)) {
                setProducts(result.products);
            } else {
                setProducts([]);
                setError(true);
            }
            setLoading(false);
        };

        loadProducts();
        return () => { isMounted = false; };
    }, [category, mode, query]);

    const handleSearch = (event) => {
        event.preventDefault();
        const value = searchInput.trim();
        navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
    };

    const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
    const currentPage = Math.min(requestedPage, pageCount);
    const pageProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const paginationItems = getPaginationItems(currentPage, pageCount);
    const currentCategorySlug = mode === 'category' ? slug : null;

    const goToPage = (page) => {
        const nextParams = new URLSearchParams(searchParams);
        if (page <= 1) nextParams.delete('page');
        else nextParams.set('page', String(page));
        setSearchParams(nextParams, { replace: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const title = mode === 'category'
        ? (category?.name || 'Category not found')
        : (mode === 'search' && query ? `Search results for “${query}”` : 'All Products');

    return (
        <div className="store-page">
            <Navbar />
            <main className="container listing-page">
                <nav className="listing-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={15} />
                    <span>{mode === 'category' ? (category?.name || 'Category') : (mode === 'search' ? 'Search' : 'All Products')}</span>
                </nav>

                <header className="listing-header">
                    <div>
                        <span className="listing-eyebrow">SINDHI NAMKEEN &amp; DRY FRUITS</span>
                        <h1>{title}</h1>
                    </div>
                    <form className="listing-search" onSubmit={handleSearch} role="search">
                        <Search size={18} aria-hidden="true" />
                        <input
                            type="search"
                            autoFocus={mode === 'search'}
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search for products..."
                            aria-label="Search products"
                        />
                        <button type="submit" aria-label="Submit search"><ArrowRight size={18} /></button>
                    </form>
                </header>

                <nav className="listing-category-chips" aria-label="Shop by category">
                    <Link to="/products" className={`listing-chip${mode === 'products' || (mode === 'search' && !query) ? ' is-active' : ''}`} aria-current={mode === 'products' || (mode === 'search' && !query) ? 'page' : undefined}>All</Link>
                    {categories.map((item) => (
                        <Link
                            key={item.slug}
                            to={`/category/${item.slug}`}
                            className={`listing-chip${currentCategorySlug === item.slug ? ' is-active' : ''}`}
                            aria-current={currentCategorySlug === item.slug ? 'page' : undefined}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="listing-result-summary">
                    <h2>{mode === 'category' ? (category?.name || 'Category') : (mode === 'search' && query ? `Results for “${query}”` : 'All Products')}</h2>
                    {!loading && !error && <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>}
                </div>

                {loading ? (
                    <div className="listing-state" role="status">Loading products...</div>
                ) : error ? (
                    <div className="listing-state listing-state-error" role="alert">
                        <AlertCircle size={22} />
                        <span>Products could not be loaded. Please try again.</span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="listing-state">
                        <h2>{mode === 'category' && !category ? 'Category not found' : 'No products found'}</h2>
                        <p>{mode === 'search' ? 'Try another product name or browse a category.' : 'Explore another part of the shop.'}</p>
                        <Link to="/" className="btn-secondary">Back to home</Link>
                    </div>
                ) : (
                    <>
                        <div className="store-product-grid listing-product-grid">
                            {pageProducts.map((product) => (
                                <ProductCard
                                    key={product._id || product.id}
                                    product={product}
                                    onViewDetails={setActiveModalProduct}
                                />
                            ))}
                        </div>
                        {pageCount > 1 && (
                            <nav className="listing-pagination" aria-label="Product pages">
                                <button type="button" className="pagination-edge" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <div className="pagination-pages">
                                    {paginationItems.map((item) => typeof item === 'number' ? (
                                        <button
                                            type="button"
                                            key={item}
                                            onClick={() => goToPage(item)}
                                            className={`pagination-page${item === currentPage ? ' is-active' : ''}`}
                                            aria-current={item === currentPage ? 'page' : undefined}
                                            aria-label={`Page ${item}`}
                                        >
                                            {item}
                                        </button>
                                    ) : <span key={item} className="pagination-ellipsis" aria-hidden="true">…</span>)}
                                </div>
                                <button type="button" className="pagination-edge" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>
                                    Next
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </main>
            {activeModalProduct && (
                <ProductDetailModal product={activeModalProduct} onClose={() => setActiveModalProduct(null)} />
            )}
            <Footer />
        </div>
    );
};

export default ProductListingPage;