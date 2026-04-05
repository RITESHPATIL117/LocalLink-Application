'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' // default
  });
  
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(registerUser(formData)).unwrap();
      if (res.user.role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (isAuthenticated || authLoading) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join LocalHub and connect locally</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={styles.roleToggle}>
            <button 
              type="button" 
              style={{ ...styles.roleBtn, ...(formData.role === 'customer' ? styles.roleBtnActive : {}) }}
              onClick={() => setFormData({ ...formData, role: 'customer' })}
            >
              I need a service
            </button>
            <button 
              type="button" 
              style={{ ...styles.roleBtn, ...(formData.role === 'provider' ? styles.roleBtnActive : {}) }}
              onClick={() => setFormData({ ...formData, role: 'provider' })}
            >
              I am a provider
            </button>
          </div>

          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required autoCapitalize="words" />
          <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          <InputField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required />

          <Button type="submit" loading={loading} style={{ marginTop: '16px', width: '100%' }}>
            Complete Registration
          </Button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: '800', textDecoration: 'none' }}>
              Sign in
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
  roleToggle: {
    display: 'flex',
    backgroundColor: 'var(--color-surface-secondary)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '8px'
  },
  roleBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s',
  },
  roleBtnActive: {
    backgroundColor: '#FFF',
    color: 'var(--color-primary)',
    boxShadow: 'var(--shadow-sm)'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px'
  }
};
