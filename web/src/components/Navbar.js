'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link href="/" style={styles.logo}>
          LocalHub
        </Link>
        <div style={styles.links}>
          <Link href="/search" style={styles.link}>Services</Link>
          <Link href="/#how-it-works" style={styles.link}>How it Works</Link>
          
          {mounted && isAuthenticated ? (
            <div style={styles.authGroup}>
              {user?.role === 'provider' && (
                <Link href="/provider/dashboard" style={styles.link}>Dashboard</Link>
              )}
              {user?.role === 'admin' && (
                <Link href="/admin/dashboard" style={styles.link}>Admin Panel</Link>
              )}
              <Link href="/requests" style={styles.link}>My Requests</Link>
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '14px', fontWeight: '800' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </Link>
            </div>
          ) : mounted ? (
            <div style={styles.authGroup}>
              <Link href="/login" style={styles.link}>Login</Link>
              <Link href="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '900',
    color: 'var(--color-primary)',
    letterSpacing: '-0.5px'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'color 0.2s'
  },
  authGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: '1px solid var(--color-border)',
    paddingLeft: '24px'
  }
};
