import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

const LocationMap = ({ variant = 'light', title = "Find Us — Model Town Park, Rohtak", style = {} }) => {
    // Model Town Park, Rohtak, Haryana coordinates
    const lat = 28.8955;
    const lon = 76.6066;
    const delta = 0.006; // Tight ~0.006° delta (~650m) for clear local neighborhood view

    const left = (lon - delta).toFixed(4);
    const bottom = (lat - delta).toFixed(4);
    const right = (lon + delta).toFixed(4);
    const top = (lat + delta).toFixed(4);

    // OpenStreetMap Embed URL using unencoded literal commas (not %2C) so OSM parses floats correctly
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;

    const isDark = variant === 'dark';

    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            borderRadius: 'var(--radius-lg, 16px)',
            overflow: 'hidden',
            backgroundColor: isDark ? '#28201b' : '#ffffff',
            border: isDark ? '1px solid #3d3129' : '1px solid var(--border-light, #ebdccf)',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.25)' : 'var(--shadow-sm, 0 2px 8px rgba(43, 34, 30, 0.05))',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.85rem',
            boxSizing: 'border-box',
            ...style,
        }}>
            {/* Header Title */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: isDark ? '#ffffff' : 'var(--text-main, #2b221e)',
            }}>
                <MapPin size={16} color="var(--primary, #d9531e)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                </span>
            </div>

            {/* OpenStreetMap Iframe */}
            <div style={{
                width: '100%',
                height: '180px',
                borderRadius: 'var(--radius-md, 12px)',
                overflow: 'hidden',
                backgroundColor: isDark ? '#1d1714' : '#f7f3ec',
                position: 'relative',
            }}>
                <iframe
                    title="Shop Location — Model Town Park, Rohtak"
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                />
            </div>

            {/* Get Directions Button / Link */}
            <a
                href="https://www.google.com/maps/search/?api=1&query=Model+Town+Park,+Rohtak"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm, 8px)',
                    backgroundColor: isDark ? 'rgba(217, 83, 30, 0.15)' : 'var(--primary-light, #fff2eb)',
                    color: 'var(--primary, #d9531e)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: isDark ? '1px solid rgba(217, 83, 30, 0.3)' : '1px solid rgba(217, 83, 30, 0.2)',
                    marginTop: '0.1rem',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary, #d9531e)';
                    e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(217, 83, 30, 0.15)' : 'var(--primary-light, #fff2eb)';
                    e.currentTarget.style.color = 'var(--primary, #d9531e)';
                }}
            >
                <Navigation size={14} />
                <span>Get Directions</span>
                <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.8 }} />
            </a>
        </div>
    );
};

export default LocationMap;
