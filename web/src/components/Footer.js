'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, 
  FiDownload, FiExternalLink, FiShield, FiCheckCircle 
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Upper Footer - Mega Menu */}
        <div style={styles.megaGrid}>
          {/* Brand Info */}
          <div style={styles.brandCol}>
            <div style={styles.logoRow}>
              <div style={styles.logoBadge}>
                <FiMapPin color="#FFF" size={18} />
              </div>
              <span style={styles.logoText}>Local<span style={{ color: 'var(--color-primary)' }}>Hub</span></span>
            </div>
            <p style={styles.brandDesc}>
              Connecting millions of users with top-rated local professionals since 2024. 
              Reliable, verified, and always at your service.
            </p>
            <div style={styles.socialRow}>
              <a href="#" style={styles.socialLink}><FiFacebook /></a>
              <a href="#" style={styles.socialLink}><FiTwitter /></a>
              <a href="#" style={styles.socialLink}><FiInstagram /></a>
              <a href="#" style={styles.socialLink}><FiLinkedin /></a>
            </div>
          </div>

          {/* Popular Services */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Popular Services</h4>
            <ul style={styles.linkList}>
              <li><Link href="/search?q=Cleaning" style={styles.footerLink}>Home Deep Cleaning</Link></li>
              <li><Link href="/search?q=AC" style={styles.footerLink}>AC Repair & Service</Link></li>
              <li><Link href="/search?q=Plumber" style={styles.footerLink}>Expert Plumbers</Link></li>
              <li><Link href="/search?q=Salon" style={styles.footerLink}>Salon at Home</Link></li>
              <li><Link href="/search?q=Electrician" style={styles.footerLink}>Electricians</Link></li>
              <li><Link href="/search?q=Pest" style={styles.footerLink}>Pest Control</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Company</h4>
            <ul style={styles.linkList}>
              <li><Link href="/about" style={styles.footerLink}>About Us</Link></li>
              <li><Link href="/contact" style={styles.footerLink}>Contact Us</Link></li>
              <li><Link href="/categories" style={styles.footerLink}>Browse All Categories</Link></li>
              <li><Link href="/support" style={styles.footerLink}>Support Center</Link></li>
              <li><Link href="/terms" style={styles.footerLink}>Terms of Service</Link></li>
              <li><Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Provider & Apps */}
          <div style={styles.appCol}>
            <h4 style={styles.colTitle}>For Professionals</h4>
            <Link href="/login" style={styles.providerBtn}>
              <FiExternalLink />
              <span>List Your Business for Free</span>
            </Link>
            
            <div style={{ marginTop: '32px' }}>
              <h4 style={styles.colTitle}>Download Our App</h4>
              <div style={styles.appBtns}>
                <div style={styles.appPlaceholder}>
                   <FiDownload size={14} /> <span>App Store</span>
                </div>
                <div style={styles.appPlaceholder}>
                   <FiDownload size={14} /> <span>Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer - Copyright & Trust */}
        <div style={styles.bottomBar}>
          <div style={styles.trustBadges}>
            <div style={styles.trustItem}>
              <FiShield color="#10B981" />
              <span>100% Secured Payments</span>
            </div>
            <div style={styles.trustItem}>
              <FiCheckCircle color="#10B981" />
              <span>Verified Professionals</span>
            </div>
          </div>
          
          <div style={styles.copyright}>
            &copy; {currentYear} <span style={{ fontWeight: '800' }}>LocalHub Elite Pro</span>. 
            Powered by PURPLE LABS. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0F172A',
    color: '#E2E8F0',
    padding: '40px 0 24px 0',
    borderTop: '1px solid #1E293B',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  },
  megaGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr',
    gap: '60px',
    paddingBottom: '60px',
    borderBottom: '1px solid #1E293B',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoBadge: {
    backgroundColor: 'var(--color-primary)',
    padding: '8px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    fontSize: '26px',
    fontWeight: '900',
    letterSpacing: '-1px',
    color: '#FFF'
  },
  brandDesc: {
    fontSize: '15px',
    color: '#94A3B8',
    lineHeight: '1.6',
    maxWidth: '300px'
  },
  socialRow: {
    display: 'flex',
    gap: '16px'
  },
  socialLink: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#1E293B',
    color: '#FFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    transition: 'all 0.2s',
    textDecoration: 'none'
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  colTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#FFF',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  footerLink: {
    color: '#94A3B8',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
    fontWeight: '500'
  },
  appCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  providerBtn: {
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    padding: '16px 24px',
    borderRadius: '16px',
    textDecoration: 'none',
    fontWeight: '800',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 10px 20px rgba(30,64,175,0.2)',
    transition: 'transform 0.2s'
  },
  appBtns: {
    display: 'flex',
    gap: '12px'
  },
  appPlaceholder: {
    backgroundColor: '#1E293B',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #334155'
  },
  bottomBar: {
    paddingTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  trustBadges: {
    display: 'flex',
    gap: '32px'
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#94A3B8',
    fontWeight: '600'
  },
  copyright: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '600'
  }
};
