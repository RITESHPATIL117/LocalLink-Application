'use client';
import React from 'react';
import Link from 'next/link';
import { FiHome, FiSearch, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <FiAlertCircle size={80} color="var(--color-primary, #3B82F6)" />
          <h1 style={styles.errorCode}>404</h1>
        </div>
        
        <h2 style={styles.title}>Oops! Page Not Found</h2>
        <p style={styles.subtitle}>
          The link you followed might be broken, or the page may have been removed. 
          Don't worry, even the best pros get lost sometimes.
        </p>

        <div style={styles.actions}>
          <Link href="/" style={styles.primaryBtn}>
            <FiHome size={20} />
            <span>Go to Homepage</span>
          </Link>
          <Link href="/search" style={styles.secondaryBtn}>
            <FiSearch size={20} />
            <span>Search Services</span>
          </Link>
        </div>

        <div style={styles.footer}>
          <p>Need help? <Link href="/support" style={styles.link}>Contact Support</Link></p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
  },
  content: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: '#FFF',
    padding: '60px 40px',
    borderRadius: '40px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
    border: '1px solid #F1F5F9',
  },
  iconContainer: {
    marginBottom: '32px',
    animation: 'float 4s ease-in-out infinite',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: '1000',
    color: '#F1F5F9',
    marginTop: '-60px',
    zIndex: -1,
    position: 'relative',
    letterSpacing: '-5px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: '16px',
    letterSpacing: '-1px',
    marginTop: '20px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748B',
    lineHeight: '1.6',
    marginBottom: '40px',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '40px',
  },
  primaryBtn: {
    backgroundColor: 'var(--color-primary, #3B82F6)',
    color: '#FFF',
    padding: '18px 32px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '800',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
    transition: 'transform 0.2s',
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '18px 32px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '800',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'background-color 0.2s',
  },
  footer: {
    borderTop: '1px solid #F1F5F9',
    paddingTop: '32px',
    color: '#94A3B8',
    fontSize: '15px',
    fontWeight: '600',
  },
  link: {
    color: 'var(--color-primary, #3B82F6)',
    textDecoration: 'none',
    fontWeight: '800',
  }
};
