'use client';
import React from 'react';
import { FiUsers, FiTarget, FiHeart, FiShield, FiStar, FiCheckCircle } from 'react-icons/fi';

export default function AboutPage() {
  const stats = [
    { label: 'Verified Pros', value: '5,000+', icon: <FiUsers /> },
    { label: 'Happy Customers', value: '50,000+', icon: <FiHeart /> },
    { label: 'Services Completed', value: '100,000+', icon: <FiCheckCircle /> },
    { label: 'Cities Covered', value: '25+', icon: <FiTarget /> },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.title}>Reimagining Local Services</h1>
          <p style={styles.subtitle}>
            LocalHub is on a mission to organize the world's local services and make them accessible, 
            reliable, and high-quality for everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div className="container" style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={styles.contentSection}>
        <div className="container" style={styles.splitGrid}>
          <div style={styles.textSide}>
            <h2 style={styles.sectionTitle}>Our Mission</h2>
            <p style={styles.paragraph}>
              We empower local professionals by providing them with the tools and platform they need to grow their businesses. 
              At the same time, we give customers peace of mind by vetting every professional on our platform.
            </p>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <FiShield style={styles.featureIcon} />
                <span>Rigorous Background Checks</span>
              </div>
              <div style={styles.featureItem}>
                <FiStar style={styles.featureIcon} />
                <span>Quality Guaranteed Results</span>
              </div>
              <div style={styles.featureItem}>
                <FiHeart style={styles.featureIcon} />
                <span>Customer-First Support</span>
              </div>
            </div>
          </div>
          <div style={styles.imageSide}>
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800" 
              alt="Team working" 
              style={styles.image}
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={styles.trustSection}>
        <div className="container" style={styles.centered}>
          <h2 style={styles.sectionTitle}>Built on Trust</h2>
          <p style={styles.paragraphCentered}>
            Since 2024, LocalHub has been the bridge between high-quality talent and the people who need it. 
            We believe that local services are the backbone of our communities.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    padding: '100px 24px',
    color: '#FFF',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '48px',
    fontWeight: '1000',
    marginBottom: '24px',
    letterSpacing: '-1.5px',
  },
  subtitle: {
    fontSize: '20px',
    lineHeight: '1.6',
    opacity: 0.8,
    fontWeight: '500',
  },
  statsSection: {
    marginTop: '-60px',
    padding: '0 24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid #F1F5F9',
  },
  statIcon: {
    fontSize: '24px',
    color: 'var(--color-primary)',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  contentSection: {
    padding: '100px 24px',
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  textSide: {
    paddingRight: '20px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: '24px',
    letterSpacing: '-1px',
  },
  paragraph: {
    fontSize: '18px',
    lineHeight: '1.7',
    color: '#475569',
    marginBottom: '32px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1E293B',
  },
  featureIcon: {
    color: 'var(--color-primary)',
    fontSize: '20px',
  },
  imageSide: {
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  trustSection: {
    backgroundColor: '#FFF',
    padding: '100px 24px',
    borderTop: '1px solid #F1F5F9',
  },
  centered: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  paragraphCentered: {
    fontSize: '20px',
    lineHeight: '1.7',
    color: '#64748B',
    fontWeight: '500',
  },
};
