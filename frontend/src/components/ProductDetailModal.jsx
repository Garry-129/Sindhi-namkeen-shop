import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const weightOptions = product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions : ['250g', '500g', '1kg'];
    const [selectedWeight, setSelectedWeight] = useState(weightOptions[0] || '250g');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    if (!product) return null;

    const getMultiplier = (weight) => {
        if (weight.toLowerCase() === '500g') return 2;
        if (weight.toLowerCase() === '1kg') return 4;
        return 1;
    };

    const calculatedPrice = product.price * getMultiplier(selectedWeight) * quantity;

    const handleAddToCart = () => {
        addToCart(product, selectedWeight, quantity);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 900);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '1rem',
        }}>
            <div className="animate-fade-in" style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '720px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                padding: '1.75rem',
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'var(--bg-muted)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                    }}
                >
                    <X size={18} color="var(--text-main)" />
                </button>

                {/* Product Image */}
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '100%', minHeight: '260px', backgroundColor: 'var(--bg-muted)' }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-saffron">{product.category}</span>
                        <span className="badge badge-gold">In Stock</span>
                    </div>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        {product.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.rating || 4.8}</span>
                        <span>• Authentic Craftsmanship from Rohtak</span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        {product.description}
                    </p>

                    {/* Weight Options */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                            Select Pack Weight:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {weightOptions.map((weight) => (
                                <button
                                    key={weight}
                                    onClick={() => setSelectedWeight(weight)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        border: selectedWeight === weight ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                        backgroundColor: selectedWeight === weight ? 'var(--primary-light)' : '#ffffff',
                                        color: selectedWeight === weight ? 'var(--primary)' : 'var(--text-main)',
                                    }}
                                >
                                    {weight}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Quantity:</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{ padding: '0.3rem 0.75rem', background: 'var(--bg-muted)', fontWeight: 800, fontSize: '1.1rem' }}
                            >
                                -
                            </button>
                            <span style={{ padding: '0.3rem 0.9rem', fontWeight: 700 }}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                style={{ padding: '0.3rem 0.75rem', background: 'var(--bg-muted)', fontWeight: 800, fontSize: '1.1rem' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Total Price & Add to Cart */}
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Amount</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{calculatedPrice}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn-primary"
                            style={{ padding: '0.75rem 1.5rem', backgroundColor: added ? 'var(--success)' : undefined }}
                        >
                            <ShoppingCart size={18} />
                            <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 640px) {
          .animate-fade-in { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default ProductDetailModal;
