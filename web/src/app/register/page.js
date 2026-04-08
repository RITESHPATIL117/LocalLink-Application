'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiHexagon, FiAlertCircle } from 'react-icons/fi';
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

  if (!hasMounted || isAuthenticated || authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main relative overflow-hidden py-24 px-6">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[540px] z-10"
      >
        <div className="bg-white rounded-[56px] p-8 md:p-14 shadow-premium border border-slate-100 relative group overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center mb-12">
            <Link href="/" className="mb-6">
              <div className="w-14 h-14 bg-primary rounded-[22px] flex items-center justify-center shadow-glow-primary transform transition-transform hover:rotate-6">
                <FiHexagon className="text-white text-2xl" />
              </div>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 text-center">Create Your Account</h1>
            <p className="text-slate-500 font-medium">Join 50K+ users and professionals</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 mb-8"
              >
                <FiAlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Role Selection Cluster */}
            <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-inner mb-4">
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.role === 'customer' 
                  ? 'bg-white text-primary shadow-subtle' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                I need a service
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'provider' })}
                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  formData.role === 'provider' 
                  ? 'bg-white text-primary shadow-subtle' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                I am a provider
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
               <div className="space-y-2">
                 <label className="ml-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                 <div className="relative group">
                   <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Johnathan Doe"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                      required
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="ml-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                 <div className="relative group">
                   <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                      required
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="ml-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                 <div className="relative group">
                   <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765-43210"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                      required
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="ml-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                 <div className="relative group">
                   <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                   <input 
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold"
                      required
                   />
                 </div>
               </div>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow transition-all flex items-center justify-center gap-3 mt-4 ${
                loading ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:brightness-110'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
              ) : (
                <>Establish Your Profile <FiArrowRight /></>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Joined before?{' '}
              <Link href="/login" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Powered by LocalHub &copy; {new Date().getFullYear()} — Premium Network
        </p>
      </motion.div>
    </div>
  );
}
