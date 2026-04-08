'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiTrendingUp, FiSettings, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const TRENDING_SEARCHES = [
  'Deep Cleaning', 'AC Service', 'Plumbing', 'Bridal Makeup', 'Painting', 'Pest Control'
];

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [location, setLocation] = useState('Sangli');
  const router = useRouter();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative z-[60] -mt-16 mb-16 px-4">
      <div className="section-container">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-6 md:p-10 rounded-[40px] shadow-premium"
        >
          <div className="flex flex-col gap-8">
            
            {/* Upper row: Location & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">
                    Expert services, <br/> 
                    <span className="text-primary italic">at your doorstep.</span>
                  </h1>
               </div>
               <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl shadow-subtle border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FiMapPin className="text-primary" />
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] font-black text-text-muted tracking-widest uppercase">Current Location</p>
                    <p className="text-sm font-bold text-text-main">{location}, Maharashtra</p>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-primary">
                    <FiSettings />
                  </button>
               </div>
            </div>

            {/* Middle row: Search Input */}
            <form 
              onSubmit={handleSearch}
              className={`relative flex items-center transition-all duration-500 rounded-[28px] ${
                isFocused ? 'ring-4 ring-primary/10 bg-white scale-[1.01]' : 'bg-slate-50'
              }`}
            >
              <div className="pl-8 text-text-muted">
                <FiSearch size={24} />
              </div>
              
              <input 
                type="text"
                placeholder="What service are you looking for?"
                className="w-full bg-transparent py-7 px-6 outline-none text-lg font-bold text-text-main placeholder:text-text-muted"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              <div className="pr-4">
                <button 
                  type="submit"
                  className="btn-premium py-4 px-10 rounded-2xl group"
                >
                  <span className="hidden md:inline">Find Pros</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* Bottom row: Trending */}
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
              <div className="flex items-center gap-2 flex-none">
                <FiTrendingUp className="text-accent" />
                <span className="text-xs font-black text-text-muted tracking-widest uppercase">Trending:</span>
              </div>
              <div className="flex gap-3">
                {TRENDING_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                    }}
                    className="flex-none px-5 py-2.5 rounded-xl bg-white border border-slate-100 text-sm font-extrabold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
