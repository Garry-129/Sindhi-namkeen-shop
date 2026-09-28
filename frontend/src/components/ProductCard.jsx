import React, { useState } from 'react';
import { ShoppingCart, Star, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onViewDetails }) => {
    const { addToCart } = useCart();
    const weightOptions = product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions : ['250g', '500g', '1kg'];
    const [selectedWeight, setSelectedWeight] = useState(weightOptions[0] || '250g');
    const [added, setAdded] = useState(false);

    // Weight multiplier calculation (250g base, 500g = 2x, 1kg = 4x)
    const getMultiplier = (weight) => {
        if (!weight) return 1;
        const lower = weight.toLowerCase();
        if (lower.includes('500g')) return 2;
        if (lower.includes('1kg')) return 4;
        return 1;
    };

    const calculatedPrice = product.price * getMultiplier(selectedWeight);

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product, selectedWeight, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    return (
        <div
            onClick={() => onViewDetails(product)}
            style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative',
                height: '100%',
            }}
            className="product-card"
        >
            {/* Category Badge & Rating Header */}
            <div className="product-card-img-container" style={{ position: 'relative', height: '160px', overflow: 'hidden', backgroundColor: 'var(--bg-muted)' }}>
                <img
                    src={product.imageUrl || '/images/products/placeholder.svg'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={(e) => {
                        e.target.src = '/images/products/placeholder.svg';
                    }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-saffron" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>{product.category}</span>
                    {product.isFeatured && <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>Featured</span>}
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                }}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <span>{product.rating || 4.8}</span>
                </div>
            </div>

            {/* Content */}
            <div className="product-card-body" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="product-card-title" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                </h3>
                <p className="product-card-desc" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </p>

                {/* Weight Selector Pills */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}
                >
                    {weightOptions.map((weight) => (
                        <button
                            key={weight}
                            onClick={() => setSelectedWeight(weight)}
                            style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.3rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                border: selectedWeight === weight ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                                backgroundColor: selectedWeight === weight ? 'var(--primary-light)' : '#ffffff',
                                color: selectedWeight === weight ? 'var(--primary)' : 'var(--text-muted)',
                                minHeight: '32px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {weight}
                        </button>
                    ))}
                </div>

                {/* Price & Action */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Price ({selectedWeight})</span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>₹{calculatedPrice}</span>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="btn-primary"
                        style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.82rem',
                            backgroundColor: added ? 'var(--success)' : undefined,
                            minHeight: '42px',
                            flexShrink: 0,
                        }}
                    >
                        {added ? <Check size={15} /> : <ShoppingCart size={15} />}
                        <span>{added ? 'Added' : 'Add'}</span>
                    </button>
                </div>
            </div>

            <style>{`
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        @media (max-width: 480px) {
          .product-card-img-container { height: 135px !important; }
          .product-card-body { padding: 0.75rem !important; }
          .product-card-title { font-size: 0.9rem !important; }
        }
      `}</style>
        </div>
    );
};

export default ProductCard;
