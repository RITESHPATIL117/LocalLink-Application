'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, FiCheckCircle, FiXCircle, FiGrid, FiList, 
  FiCalendar, FiMapPin, FiPhone, FiDollarSign, FiInfo, FiChevronRight, FiBell, FiTrash2
} from 'react-icons/fi';
import leadService from '../../services/leadService';

const STATUS_CONFIG = {
  All:       { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <FiGrid /> },
  Pending:   { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <FiClock /> },
  Accepted:  { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <FiCheckCircle /> },
  Completed: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <FiCheckCircle /> },
  Cancelled: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: <FiXCircle /> },
};

const FILTERS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isAuthenticated) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await leadService.getUserLeads();
      setRequests(res.data || []);
    } catch (e) {
      console.error('Fetch requests error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await leadService.updateLeadStatus(id, 'Cancelled');
      fetchRequests();
    } catch (e) {
      alert('Failed to cancel request');
    }
  };

  if (!hasMounted) return null;

  const filtered = activeFilter === 'All' 
    ? requests 
    : requests.filter(r => r.status?.toLowerCase() === activeFilter.toLowerCase());

  const counts = {
    Active: requests.filter(r => r.status === 'Accepted' || r.status === 'Pending').length,
    Completed: requests.filter(r => r.status === 'Completed').length,
    Cancelled: requests.filter(r => r.status === 'Cancelled').length
  };

  if (!isAuthenticated) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FiInfo size={40} className="text-slate-300" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Access Restricted</h2>
      <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Please login to view and manage your service requests.</p>
      <button 
        onClick={() => router.push('/login')} 
        className="btn-premium px-10 py-4 !rounded-2xl"
      >
        Login to Dashboard
      </button>
    </div>
  );

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* 1. Header Parity */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-6 shadow-premium">
        <div className="section-container max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ x: -4 }}
              onClick={() => router.back()} 
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
            >
              <FiChevronLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">My Ledger</h1>
              <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-primary/10 rounded-full w-fit border border-primary/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">{requests.length} TOTAL ENTRIES</span>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 relative hover:bg-white hover:text-primary transition-all"
          >
            <FiBell size={20} />
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50" />
          </motion.button>
        </div>
      </header>

      <main className="section-container max-w-7xl pt-10 pb-32">
        
        {/* 2. Stats Dashboard Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active', count: counts.Active, color: 'text-amber-500', bg: 'bg-white', border: 'border-slate-100' },
            { label: 'Completed', count: counts.Completed, color: 'text-emerald-500', bg: 'bg-white', border: 'border-slate-100' },
            { label: 'Cancelled', count: counts.Cancelled, color: 'text-red-400', bg: 'bg-white', border: 'border-slate-100' },
          ].map(stat => (
            <motion.div 
              key={stat.label}
              whileHover={{ y: -4 }}
              className={`${stat.bg} p-8 rounded-[40px] border ${stat.border} text-center shadow-subtle`}
            >
              <div className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.count}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">{stat.label} Bookings</div>
            </motion.div>
          ))}
        </section>

        {/* 3. Filter Tabs Panel */}
        <div className="bg-white/50 backdrop-blur-md border border-slate-100 p-2 rounded-[32px] mb-10 overflow-x-auto no-scrollbar flex gap-2">
          {FILTERS.map(f => {
            const active = activeFilter === f;
            const cfg = STATUS_CONFIG[f];
            return (
              <motion.button 
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${
                  active 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`text-lg ${active ? 'text-white' : 'text-slate-400'}`}>{cfg.icon}</span>
                {f}
              </motion.button>
            )
          })}
        </div>

        {/* 4. Requests List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[40px] border border-dashed border-slate-200">
               <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
               <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Refreshing booking ledger...</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-24 bg-white rounded-[40px] border border-slate-100 shadow-premium"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                <FiList size={32} className="text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">No records in ledger</h3>
              <p className="text-slate-500 font-medium mb-12">
                {activeFilter === 'All' ? "You haven't initiated any service requests yet." : `We couldn't find any ${activeFilter} requests in your history.`}
              </p>
              <button 
                onClick={() => router.push('/search')} 
                className="btn-premium px-12 py-4 !rounded-2xl"
              >
                Discover Experts
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((item, idx) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
                return (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-subtle hover:shadow-premium transition-all group flex flex-col lg:flex-row"
                  >
                    <div className="lg:w-48 h-48 lg:h-auto overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={item.businessName}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                    </div>
                    
                    <div className="p-10 flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                          {item.businessName || 'Elite Service Partner'}
                        </h4>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm flex items-center gap-2 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                          {item.status}
                        </div>
                      </div>
                      <p className="text-slate-500 font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
                        {item.service || 'Service Consultation'}
                      </p>
                      
                      <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <FiCalendar size={14} className="text-slate-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date</span>
                            <span className="text-xs font-black text-slate-600">{item.date || 'TBD'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <FiClock size={14} className="text-slate-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Time Slot</span>
                            <span className="text-xs font-black text-slate-600">{item.time || 'Awaiting Schedule'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-10 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 lg:w-72 flex flex-col justify-center">
                      <div className="mb-8">
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Estimated Total</div>
                         <div className="text-3xl font-black text-slate-900 tracking-tighter">
                            {item.price || (item.amount ? `₹${item.amount}` : '₹499')}
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {item.status === 'Accepted' && (
                          <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                            Proceed to Slot <FiChevronRight />
                          </button>
                        )}
                        
                        <div className="flex gap-3">
                          <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
                            <FiPhone size={14} className="text-primary" /> Call
                          </button>
                          {item.status === 'Pending' && (
                            <button 
                              onClick={() => handleCancelBooking(item.id)}
                              className="flex-1 bg-white text-red-500 border border-red-200 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center"
                              title="Cancel Request"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
