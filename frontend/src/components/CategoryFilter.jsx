import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

const categories = ['All', 'Namkeen', 'Dry Fruits', 'Biscuits', 'Mukhwas', 'Papad', 'Achar', 'Masala'];

const CategoryFilter = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    return (
        <div
            id="category-filter-section"
            style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                marginBottom: '2rem',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Category Pills Scroller / Grid */}
                <div
                    className="category-pills-container"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '0.25rem',
                        paddingTop: '0.1rem',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onSelectCategory(cat)}
                                style={{
                                    padding: '0.55rem 1.1rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700,
                                    fontSize: '0.88rem',
                                    backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-muted)',
                                    color: isActive ? '#ffffff' : 'var(--text-main)',
                                    border: isActive ? 'none' : '1px solid var(--border-light)',
                                    boxShadow: isActive ? '0 4px 10px rgba(217, 83, 30, 0.25)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    whiteSpace: 'nowrap',
                                    minHeight: '44px',
                                    flexShrink: 0,
                                }}
                            >
                                {cat === 'Namkeen' && '🥨'}
                                {cat === 'Dry Fruits' && '🥜'}
                                {cat === 'Biscuits' && '🍪'}
                                {cat === 'Mukhwas' && '🌿'}
                                {cat === 'Papad' && '🫓'}
                                {cat === 'Achar' && '🫙'}
                                {cat === 'Masala' && '🌶️'}
                                {cat === 'All' && '✨'}
                                <span>{cat}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Input Box */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search namkeen, badam, papad, masala..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.65rem 1rem 0.65rem 2.5rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-cream)',
                            color: 'var(--text-main)',
                            fontSize: '0.9rem',
                            minHeight: '44px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>

            <style>{`
        .category-pills-container::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 600px) {
          .category-pills-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
            overflow-x: visible !important;
          }
          .category-pills-container button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
        </div>
    );
};

export default CategoryFilter;
