'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiMapPin, FiBriefcase, FiArrowRight, FiSettings, 
  FiHeart, FiClipboard, FiHeadphones, FiLogOut, FiEdit3, FiShield, FiChevronRight, FiChevronLeft
} from 'react-icons/fi';
import { logoutUser } from '../../store/authSlice';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(logoutUser());
      router.push('/login');
    }
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* 1. Immersive Profile Header */}
      <header className="bg-primary relative overflow-hidden h-[340px] flex items-center shadow-premium">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" 
        />

        <div className="section-container max-w-4xl relative z-10 w-full">
          <div className="flex justify-between items-center mb-12">
             <motion.button 
               whileHover={{ x: -4 }}
               onClick={() => router.back()} 
               className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
             >
               <FiChevronLeft size={24} />
             </motion.button>
             <motion.button 
               whileHover={{ rotate: 90 }}
               className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
             >
                <FiSettings size={22} />
             </motion.button>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-end">
             <div className="relative group">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] border-8 border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden shadow-premium group-hover:scale-105 transition-transform duration-500"
                >
                   <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=4f46e5&color=fff`} 
                    className="w-full h-full object-cover" 
                    alt="Profile Avatar"
                   />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-glow text-primary cursor-pointer border-4 border-primary"
                >
                   <FiEdit3 size={18} />
                </motion.div>
             </div>
             
             <div className="text-center md:text-left pb-4">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                >
                  {user?.name || 'Elite User'}
                </motion.h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                   <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                     {(user?.role || 'Customer').toUpperCase()}
                   </span>
                   <div className="flex items-center gap-2 text-white/70 text-sm font-bold bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                      <FiMapPin size={14} className="text-primary-light" /> Sangli, MH
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="section-container max-w-4xl -mt-10 pb-32 relative z-[20]">
        
        {/* 2. Personalized Dashboard Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[
             { label: 'Orders', count: '12', icon: <FiClipboard className="text-amber-500" /> },
             { label: 'Saved', count: '8', icon: <FiHeart className="text-red-500" /> },
             { label: 'Support', count: '24/7', icon: <FiHeadphones className="text-indigo-500" /> },
           ].map((metric, idx) => (
             <motion.div 
               key={metric.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               whileHover={{ y: -5 }}
               className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-subtle group hover:border-primary/20 transition-all"
             >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  {metric.icon}
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{metric.count}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{metric.label}</div>
             </motion.div>
           ))}
        </section>

        {/* 3. Account Menu Cluster */}
        <section className="bg-white rounded-[56px] border border-slate-100 overflow-hidden shadow-premium group">
           <div className="divide-y divide-slate-50">
             {[
               { label: 'My Bookings', ic: <FiClipboard />, color: 'text-amber-600', bg: 'bg-amber-50', route: '/requests' },
               { label: 'Saved Professionals', ic: <FiHeart />, color: 'text-red-600', bg: 'bg-red-50', route: '/favorites' },
               { label: 'Account Settings', ic: <FiSettings />, color: 'text-indigo-600', bg: 'bg-indigo-50', route: '/settings' },
               { label: 'Help & Support', ic: <FiHeadphones />, color: 'text-emerald-600', bg: 'bg-emerald-50', route: '/support' },
               { label: 'Privacy & Security', ic: <FiShield />, color: 'text-slate-600', bg: 'bg-slate-50', route: '#' },
             ].map((item, idx) => (
               <Link href={item.route} key={item.label}>
                  <motion.div 
                    whileHover={{ x: 8 }}
                    className="group px-10 py-6 flex justify-between items-center cursor-pointer transition-all hover:bg-slate-50/50"
                  >
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                          {item.ic}
                        </div>
                        <span className="text-lg font-black text-slate-800 tracking-tight">{item.label}</span>
                     </div>
                     <FiChevronRight className="text-slate-300 group-hover:text-primary transition-colors" size={24} />
                  </motion.div>
               </Link>
             ))}
           </div>
        </section>

        {/* 4. Provider Special Access */}
        {user?.role === 'provider' && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <Link href="/provider/dashboard">
              <motion.div 
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-slate-950 text-white p-10 rounded-[48px] flex items-center justify-between shadow-premium relative overflow-hidden group border border-white/5"
              >
                {/* Background Decor */}
                <FiBriefcase className="absolute -bottom-10 -right-10 text-white/5 rotate-12" size={200} />
                
                <div className="relative z-10 flex items-center gap-8">
                   <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-glow group-hover:rotate-6 transition-transform">
                      <FiBriefcase size={32} />
                   </div>
                   <div>
                     <h4 className="text-2xl font-black tracking-tighter mb-1">Provider Dashboard</h4>
                     <p className="text-white/40 font-medium">Manage your pro-profile & listings</p>
                   </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform relative z-10">
                  <FiArrowRight size={24} />
                </div>
              </motion.div>
            </Link>
          </motion.section>
        )}

        {/* 5. Danger Zone - Sign Out */}
        <motion.button 
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full mt-10 p-6 rounded-[32px] bg-red-50 border border-red-100 text-red-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-red-100 transition-all shadow-subtle group"
        >
          <FiLogOut className="group-hover:rotate-12 transition-transform" /> TERMINATE SESSION
        </motion.button>

        <p className="text-center mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
           LocalHub Elite Security &copy; {new Date().getFullYear()}
        </p>

      </main>
    </div>
  );
}
