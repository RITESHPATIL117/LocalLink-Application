'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [hasMounted, setHasMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router, hasMounted]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      if (res.user.role === 'provider') {
        router.push('/provider/dashboard');
      } else if (res.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated || authLoading) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your LocalHub account</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <Link href="/forgot-password" style={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" loading={loading} style={{ marginTop: '16px', width: '100%' }}>
            Sign In
          </Button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: '800', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F3F4F6 0%, #E0E7FF 100%)',
    padding: '20px'
  },
  card: {
    background: 'var(--color-surface)',
    width: '100%',
    maxWidth: '440px',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: 'var(--shadow-card)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '900',
    color: 'var(--color-text)',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)'
  },
  errorAlert: {
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    color: 'var(--color-error)',
    borderRadius: '12px',
    border: '1px solid #FCA5A5',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center'
  },
  forgotLink: {
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '700',
    textDecoration: 'none'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px'
  }
};
