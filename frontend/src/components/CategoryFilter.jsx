import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

const categories = ['All', 'Namkeen', 'Dry Fruits', 'Biscuits'];

const CategoryFilter = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '2rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Category Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onSelectCategory(cat)}
                                style={{
                                    padding: '0.55rem 1.25rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-muted)',
                                    color: isActive ? '#ffffff' : 'var(--text-main)',
                                    border: isActive ? 'none' : '1px solid var(--border-light)',
                                    boxShadow: isActive ? '0 4px 10px rgba(217, 83, 30, 0.25)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                {cat === 'Namkeen' && '🥨'}
                                {cat === 'Dry Fruits' && '🥜'}
                                {cat === 'Biscuits' && '🍪'}
                                {cat === 'All' && '✨'}
                                <span>{cat}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Input Box */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search namkeen, badam, biscuits..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.55rem 1rem 0.55rem 2.25rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-cream)',
                            color: 'var(--text-main)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
