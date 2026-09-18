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
        if (weight.toLowerCase() === '500g') return 2;
        if (weight.toLowerCase() === '1kg') return 4;
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
            }}
            className="product-card"
        >
            {/* Category Badge & Rating */}
            <div style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: 'var(--bg-muted)' }}>
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80';
                    }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-saffron">{product.category}</span>
                    {product.isFeatured && <span className="badge badge-gold">Featured</span>}
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                }}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <span>{product.rating || 4.8}</span>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {product.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </p>

                {/* Weight Selector Pills */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem', flexWrap: 'wrap' }}
                >
                    {weightOptions.map((weight) => (
                        <button
                            key={weight}
                            onClick={() => setSelectedWeight(weight)}
                            style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.55rem',
                                borderRadius: 'var(--radius-sm)',
                                border: selectedWeight === weight ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                                backgroundColor: selectedWeight === weight ? 'var(--primary-light)' : '#ffffff',
                                color: selectedWeight === weight ? 'var(--primary)' : 'var(--text-muted)',
                            }}
                        >
                            {weight}
                        </button>
                    ))}
                </div>

                {/* Price & Action */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-light)' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price ({selectedWeight})</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{calculatedPrice}</span>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="btn-primary"
                        style={{
                            padding: '0.55rem 0.95rem',
                            fontSize: '0.85rem',
                            backgroundColor: added ? 'var(--success)' : undefined,
                        }}
                    >
                        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                        <span>{added ? 'Added' : 'Add'}</span>
                    </button>
                </div>
            </div>

            <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
        </div>
    );
};

export default ProductCard;
