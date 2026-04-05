'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function BusinessCard({ business, compact = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false); // Can hook up useFavorites later

  const imageSrc = (business.image_url && business.image_url.length > 10) 
    ? business.image_url 
    : (business.image && business.image.length > 10) 
      ? business.image 
      : `https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400&sig=${business.name || 'service'}`;

  const isVerified = business.is_verified || business.tier === 'Diamond';

  return (
    <article
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        ...styles.card,
        borderColor: business.tier === 'Diamond' ? '#FDE68A' : 'var(--color-surface)',
      }}
    >
      <div style={{ ...styles.imageContainer, height: compact ? '140px' : '220px', width: compact ? '140px' : '100%' }}>
        <img 
          src={imageSrc} 
          alt={business.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {isVerified && (
          <div style={{ ...styles.verifiedBadge, backgroundColor: business.tier === 'Diamond' ? '#F59E0B' : 'rgba(30,58,138,0.9)' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#FFF' }}>
              {business.tier === 'Diamond' ? '★ ELITE PRO' : '🛡️ VERIFIED'}
            </span>
          </div>
        )}
        <div style={styles.ratingBadge}>
          <span style={styles.ratingText}>{business.rating || '4.5'} ★</span>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
          style={styles.favoriteBadge}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={{ padding: compact ? '12px' : '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.categoryRow}>
          <span style={styles.categoryText}>{business.category || 'Service'}</span>
          <span style={styles.dot}></span>
          <span style={styles.statusText}>Live Now</span>
        </div>
        
        <h3 style={styles.name}>{business.name}</h3>
        
        <div style={styles.infoRow}>
          <span>📍</span>
          <span style={styles.infoText}>{business.address}</span>
        </div>

        {!compact && (
          <div style={styles.trustRow}>
            <span style={styles.trustBadge}>⏱️ Instant Response</span>
            <span style={styles.trustBadge}>🔄 98% Repeat Rate</span>
          </div>
        )}

        <div style={{ ...styles.footer, marginTop: 'auto' }}>
          <div>
            <div style={styles.priceLabel}>Service Start</div>
            <div style={styles.priceValue}>₹499</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!compact && (
              <Link href={`/business/${business.id}`} style={styles.detailsBtn}>
                DETAILS
              </Link>
            )}
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

const styles = {
  card: {
    borderWidth: '1.5px',
    borderStyle: 'solid',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: 'var(--color-background)',
  },
  verifiedBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    padding: '6px 12px',
    borderRadius: '12px',
  },
  ratingText: {
    color: '#FFF',
    fontSize: '12px',
    fontWeight: '900',
  },
  favoriteBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  categoryText: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  dot: {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-border)',
    margin: '0 8px',
  },
  statusText: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-success)',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: '18px',
    fontWeight: '900',
    color: 'var(--color-text)',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '13px',
  },
  infoText: {
    color: 'var(--color-text-secondary)',
    marginLeft: '6px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  trustRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '800',
    color: '#0D9488',
    border: '1px solid #CCFBF1',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)',
  },
  priceLabel: {
    fontSize: '9px',
    color: 'var(--color-text-secondary)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  priceValue: {
    fontSize: '16px',
    fontWeight: '900',
    color: 'var(--color-text)',
  },
  detailsBtn: {
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid var(--color-border)',
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.5px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  }
};
