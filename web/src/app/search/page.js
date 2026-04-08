'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiMap, FiList, FiStar, FiMapPin, FiArrowLeft, FiZap, FiChevronRight, FiChevronLeft, FiX
} from 'react-icons/fi';
import businessService from '../../services/businessService';
import BusinessCard from '../../components/BusinessCard';

const FILTERS = ['Top Rated', 'Near Me', 'Open Now', 'Price', 'Newest'];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';

  const [search, setSearch] = useState(query);
  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchResults();
  }, [query, categoryId, activeFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = {
        q: query,
        category_id: categoryId,
        filter: activeFilter.toLowerCase().replace(' ', '_'),
      };
      const res = await businessService.getAllBusinesses(params).catch(() => ({ data: [] }));
      setResults(res.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="bg-bg-main min-h-screen pb-24">
      
      {/* 1. High-Fidelity Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] shadow-premium">
        <div className="section-container max-w-7xl py-5">
          <div className="flex items-center gap-5">
            <motion.button 
              whileHover={{ x: -4 }}
              onClick={() => router.back()} 
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
            >
              <FiArrowLeft size={20} />
            </motion.button>

            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative group">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search local experts in Sangli..."
                  className="w-full pl-14 pr-12 py-4 rounded-2xl border border-slate-200 bg-slate-50 group-focus-within:bg-white group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/5 text-slate-900 font-semibold outline-none transition-all shadow-inner"
                />
                {search && (
                  <button 
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </form>

            <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-subtle' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FiList size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-subtle' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FiMap size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <div className="section-container max-w-7xl pb-4 overflow-x-auto no-scrollbar flex gap-3">
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <motion.button 
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all ${
                  active 
                  ? 'bg-primary border-primary text-white shadow-glow' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f}
              </motion.button>
            )
          })}
        </div>
      </header>

      <main className="section-container max-w-7xl pt-10">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
              {query ? `Results for "${query}"` : (categoryId ? 'Category Specialists' : 'All Marketplace Professionals')}
            </h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {results.length} EXPERTS FOUND NEAR YOU
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
            <div className="w-12 h-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin mb-6" />
            Synchronizing Marketplace data...
          </div>
        ) : results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-24 text-center border border-slate-100 shadow-premium"
          >
            <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center text-4xl mx-auto mb-10 shadow-inner">
              🔍
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">No direct matches found</h3>
            <p className="text-slate-500 text-lg font-medium max-w-md mx-auto mb-12 leading-relaxed">
              We couldn't find any professionals matching that search. try expanding your filters or search for another neighborhood in Sangli.
            </p>
            <button 
              onClick={() => { setSearch(''); router.push('/search'); }}
              className="btn-premium px-10 py-4 !rounded-2xl"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            <AnimatePresence>
              {results.map((biz) => (
                <motion.div
                  layout
                  key={biz.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BusinessCard business={biz} horizontal={viewMode === 'list'} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Floating CTA */}
      {results.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110]">
          <motion.button 
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-950 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10"
          >
            <FiZap className="text-primary" /> Get Best Price Quote
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-primary animate-pulse">BOOTING SEARCH SYSTEM...</div>}>
      <SearchContent />
    </Suspense>
  );
}
