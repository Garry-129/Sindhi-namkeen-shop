import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import LocationMap from './LocationMap';

const LocationMapModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(29, 23, 20, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
                animation: 'fadeIn 0.2s ease-out',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '440px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg, 20px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-light, #ebdccf)',
                    padding: '1.25rem',
                    animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close location map modal"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-muted, #f7f3ec)',
                        border: '1px solid var(--border-light, #ebdccf)',
                        color: 'var(--text-main, #2b221e)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary-light, #fff2eb)';
                        e.currentTarget.style.color = 'var(--primary, #d9531e)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-muted, #f7f3ec)';
                        e.currentTarget.style.color = 'var(--text-main, #2b221e)';
                    }}
                >
                    <X size={18} />
                </button>

                {/* Location Map Widget Inside Modal */}
                <LocationMap variant="light" style={{ width: '100%', maxWidth: '100%', boxShadow: 'none', border: 'none', padding: 0 }} />
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LocationMapModal;
