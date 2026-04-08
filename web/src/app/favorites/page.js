'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiSearch, FiStar, FiMapPin, FiChevronRight, FiGrid, FiList, FiAward, FiArrowRight, FiChevronLeft
} from 'react-icons/fi';
import Link from 'next/link';

const CATEGORIES = ['All', 'Home Services', 'Personal Care', 'Cleaning', 'Repair'];

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [favorites, setFavorites] = useState([]); // In production this would sync with Redux/Backend
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Filter Logic
  const filteredFavorites = favorites.filter(b => {
    const categoryMatch = activeTab === 'All' || b.category?.toLowerCase() === activeTab.toLowerCase();
    const searchMatch = !search.trim() || 
      b.name?.toLowerCase().includes(search.toLowerCase()) || 
      b.category?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (!mounted) return null;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-10 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-red-50 text-red-100 rounded-full flex items-center justify-center mb-8"
      >
        <FiHeart size={48} className="text-red-200" />
      </motion.div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Saved Places Secure Access</h2>
      <p className="text-slate-500 font-medium max-w-xs mb-10">Please authenticate your account to view and manage your curated list of professionals.</p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/login')} 
        className="btn-premium px-12 py-4 !rounded-2xl"
      >
        Authorized Login
      </motion.button>
    </div>
  );

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* 1. Immersive Header & Precision Filters */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-8 shadow-premium">
        <div className="section-container max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div className="flex items-center gap-6">
              <motion.button 
                whileHover={{ x: -4 }}
                onClick={() => router.back()} 
                className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
              >
                <FiChevronLeft size={24} />
              </motion.button>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Favorites</h1>
                <div className="inline-flex gap-2 items-center bg-red-50 px-3 py-1 rounded-lg mt-2 border border-red-100/50">
                  <FiHeart className="text-red-500 fill-red-500" size={12} />
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{favorites.length} Saved Specialists</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-96 relative group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your saved services..."
                className="w-full pl-12 pr-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-800 shadow-subtle"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((f, idx) => {
              const active = activeTab === f;
              return (
                <motion.button 
                  key={f}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveTab(f)}
                  className={`
                    whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border
                    ${active 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg px-8' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600 shadow-subtle'}
                  `}
                >
                  {f}
                </motion.button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="section-container max-w-6xl py-16">
        
        {favorites.length === 0 ? (
          
          /* 2. Enhanced Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-10 bg-white rounded-[56px] border border-slate-100 shadow-premium max-w-3xl mx-auto"
          >
            <div className="relative w-40 h-40 mx-auto mb-12">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full rounded-[48px] bg-red-50 flex items-center justify-center shadow-glow-red/5"
              >
                <FiHeart size={72} className="text-red-500 fill-red-500 opacity-80" />
              </motion.div>
              <motion.div 
                animate={{ rotate: [0, 15, 0], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-amber-500"
              >
                <FiStar size={40} className="fill-amber-500 drop-shadow-lg" />
              </motion.div>
              <motion.div 
                animate={{ rotate: [0, -15, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 text-primary"
              >
                <FiAward size={36} className="drop-shadow-lg" />
              </motion.div>
            </div>

            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 underline decoration-primary/20 decoration-8 underline-offset-8">Nothing feels like home yet</h2>
            <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto mb-12 leading-relaxed">
              Found a local specialist you love? Tap the heart icon on their profile to build your elite circle of providers.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/search')}
              className="px-12 py-5 rounded-[24px] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 mx-auto shadow-2xl hover:bg-primary transition-all group"
            >
              <FiSearch /> Discover Experts <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

        ) : (
          
          /* 3. High-Density Favorites Grid */
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                 <FiAward className="text-primary" /> Curated Marketplace
              </h3>
              <div className="flex gap-2">
                <button className="w-11 h-11 rounded-2xl bg-white border border-secondary/20 shadow-subtle flex items-center justify-center text-secondary">
                  <FiGrid size={20} />
                </button>
                <button className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-subtle flex items-center justify-center text-slate-300">
                  <FiList size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredFavorites.map((biz, idx) => (
                  <motion.div 
                    key={biz.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-subtle hover:shadow-premium transition-all"
                  >
                    <Link href={`/business/${biz.id}`} className="block relative h-64 overflow-hidden">
                      <img src={biz.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={biz.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-bottom p-8">
                         <div className="mt-auto">
                            <span className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                               {biz.category}
                            </span>
                         </div>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white text-red-500 shadow-premium flex items-center justify-center transition-all"
                      >
                        <FiHeart size={20} fill="currentColor" />
                      </motion.button>
                    </Link>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none truncate pr-4">{biz.name}</h4>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100 text-amber-600 font-black text-[10px]">
                           <FiStar fill="currentColor" size={12} /> 4.9
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-400 mb-8 border-l-4 border-slate-100 pl-4">Verified Professional Partner</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                           <FiMapPin className="text-primary-light" /> Sangli, MH
                        </div>
                        <Link href={`/business/${biz.id}`} className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                           Book Now <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <p className="text-center mt-32 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
           LOCAL-HUB ELITE CURATION &copy; {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
