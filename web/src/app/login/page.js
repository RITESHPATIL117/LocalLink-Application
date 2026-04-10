'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiHexagon, FiAlertCircle } from 'react-icons/fi';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [hasMounted, setHasMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      if (role === 'provider') router.push('/provider/dashboard');
      else if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/');
    }
  }, [isAuthenticated, router, hasMounted, role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(loginUser({ email, password, role })).unwrap();
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

  if (!hasMounted) return null;
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main relative overflow-hidden py-20 px-6">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-premium border border-slate-100 relative group overflow-hidden">
          {/* Logo Header */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="mb-6 group">
              <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                <FiHexagon className="text-white text-3xl" />
              </div>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Continue your LocalHub journey</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 mb-6"
              >
                <FiAlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-inner">
              {[
                { id: 'user', label: 'Customer' },
                { id: 'provider', label: 'Provider' },
                { id: 'admin', label: 'Admin' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    role === item.id ? 'bg-white text-primary shadow-subtle' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" size="sm" className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow transition-all flex items-center justify-center gap-2 ${
                loading ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white hover:brightness-110'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
              ) : (
                <>Sign In Securely <FiArrowRight /></>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                Join the Network
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          LocalHub &copy; {new Date().getFullYear()} — Secure Access
        </p>
      </motion.div>
    </div>
  );
}
