'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSearch, FiMapPin, FiCheckCircle, FiStar, FiShoppingBag } from 'react-icons/fi';
import { renderDynamicIcon } from '../../utils/iconHelper';
import categoryService from '../../services/categoryService';

export default function CategoriesPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const rawData = res.data || res || [];
      const structured = (Array.isArray(rawData) ? rawData : []).map((c, i) => ({
        ...c,
        id: c.id || `f-${i}`,
        color: c.color || '#3B82F6',
        bg: c.bg || '#EFF6FF',
        icon: c.icon || '🛠️',
      }));
      const finalCats = structured.length > 0 ? structured : FALLBACK_CATEGORIES;
      setCategories(finalCats);
      if (finalCats.length > 0) {
        handleSelectNav(finalCats[0].id);
      }
    } catch (error) {
      setCategories(FALLBACK_CATEGORIES);
      handleSelectNav(FALLBACK_CATEGORIES[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNav = async (id) => {
    setSelectedMainCat(id);
    setSubLoading(true);
    try {
      const subRes = await categoryService.getSubcategories(id);
      setActiveSubcategories(subRes.data || subRes || []);
    } catch (e) {
      setActiveSubcategories(MOCK_SUBCATEGORIES);
    } finally {
      setSubLoading(false);
    }
  };

  if (!hasMounted) return null;

  const activeCategoryData = categories.find(c => c.id === selectedMainCat) || categories[0];
  const isSearching = search.trim().length > 0;

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      {/* 1. Header Section */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[60] py-4">
        <div className="section-container max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ x: -4 }}
                onClick={() => router.back()} 
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Explore Services</h1>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-subtle">
              <FiMapPin size={14} className="text-primary" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Sangli, MH</span>
            </div>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text" 
              placeholder="Search for 'AC Repair', 'Cleaning', 'Wedding'..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-14 py-4 rounded-[20px] border border-slate-200 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 text-slate-900 font-semibold outline-none transition-all shadow-subtle"
            />
            {isSearching && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Split View Layout */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 font-bold">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
            <p>Gathering the best professionals in Sangli...</p>
          </div>
        ) : (
          <div className="flex section-container max-w-7xl pt-8 h-[calc(100vh-180px)]">
            {/* Sidebar Navigation */}
            <aside className="w-32 md:w-48 overflow-y-auto pr-4 scrollbar-hide border-r border-slate-100 group">
              <div className="flex flex-col gap-2 pb-12">
                {categories.map((cat) => {
                  const isActive = selectedMainCat === cat.id;
                  return (
                    <motion.div 
                      key={cat.id} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectNav(cat.id)}
                      className={`cursor-pointer flex flex-col items-center p-4 rounded-[28px] transition-all relative ${
                        isActive 
                        ? 'bg-primary text-white shadow-glow translate-x-2' 
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform ${
                        isActive ? 'scale-110 shadow-lg' : 'bg-slate-50 text-slate-500'
                      }`} style={{ background: isActive ? 'rgba(255,255,255,0.2)' : undefined }}>
                        {renderDynamicIcon(cat.icon, 22, isActive ? '#FFF' : '#64748B')}
                      </div>
                      <span className={`text-[11px] text-center font-black uppercase tracking-tighter leading-tight ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}>
                        {cat.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </aside>

            {/* Sub-Category Content Area */}
            <main className="flex-1 overflow-y-auto pl-8 pb-32">
              <AnimatePresence mode="wait">
                {activeCategoryData && (
                  <motion.div 
                    key={activeCategoryData.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-100">
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                          {activeCategoryData.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <p className="text-slate-500 font-bold">Verified Experts • Instant Booking Available</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1.5 text-primary">
                            <FiShoppingBag size={14} />
                            <span className="text-xs font-black uppercase tracking-widest">30+ Pros</span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-subtle"
                        style={{ backgroundColor: activeCategoryData.bg, borderColor: `${activeCategoryData.color}20` }}
                      >
                        <FiCheckCircle size={14} style={{ color: activeCategoryData.color }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: activeCategoryData.color }}>VERIFIED</span>
                      </div>
                    </div>

                    {/* Sub-Category Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
                          <p className="text-slate-400 font-bold">Refreshing marketplace...</p>
                        </div>
                      ) : activeSubcategories.length > 0 ? (
                        activeSubcategories.map((sub, idx) => (
                          <motion.div
                            key={sub.id || idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/search?q=${encodeURIComponent(sub.name)}`)}
                            className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-subtle hover:shadow-premium transition-all cursor-pointer"
                          >
                            <div className="h-40 overflow-hidden relative">
                              <img 
                                src={sub.image || SUB_FALLBACKS[idx % SUB_FALLBACKS.length]} 
                                alt={sub.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                            </div>
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                  {sub.name}
                                </h4>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                  <FiStar size={12} className="fill-amber-400 text-amber-400" />
                                  <span className="text-[10px] font-black text-amber-900">4.8</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Starts from</span>
                                <span className="text-primary font-black text-lg tracking-tighter">₹499</span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full py-20 px-10 text-center bg-slate-50 rounded-[40px] border border-slate-100">
                           <p className="text-slate-400 text-lg font-bold italic mb-2">No specialized services found here.</p>
                           <p className="text-slate-300">Try searching generally or check our trending section.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

const SUB_FALLBACKS = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300',
  'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300',
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=300',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300'
];

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: '💧', color: '#3B82F6', bg: '#EFF6FF' },
  { id: '2', name: 'Electrical', icon: '⚡', color: '#F59E0B', bg: '#FFFBEB' },
  { id: '3', name: 'Cleaning', icon: '🧹', color: '#10B981', bg: '#ECFDF5' },
  { id: '4', name: 'AC Service', icon: '❄️', color: '#06B6D4', bg: '#ECFEFF' },
  { id: '5', name: 'Salon', icon: '✂️', color: '#EC4899', bg: '#FDF2F8' },
  { id: '6', name: 'Carpentry', icon: '🪚', color: '#92400E', bg: '#FFF7ED' }
];

const MOCK_SUBCATEGORIES = [
  { id: 101, name: 'General Repair' },
  { id: 102, name: 'Installation' },
  { id: 103, name: 'Deep Cleaning' },
  { id: 104, name: 'Emergency Support' },
  { id: 105, name: 'Routine Checkup' },
];
