'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiList, FiBriefcase, FiZap, FiStar, FiCheckCircle, 
  FiXCircle, FiClock, FiSettings, FiArrowRight, FiBell, FiPlus, FiLogOut, FiCalendar, FiMapPin
} from 'react-icons/fi';
import leadService from '../../../services/leadService';
import Button from '../../../components/Button';
import { io } from 'socket.io-client';

export default function ProviderDashboard() {
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const router = useRouter();
  
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, rating: 4.8 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchLeads = async () => {
    try {
      if (!user?.id) return;
      const res = await leadService.getUserLeads(); 
      const existingLeads = res.data || [];
      
      setLeads(existingLeads);
      
      setStats({
        active: existingLeads.filter(l => l.status === 'Pending').length,
        completed: existingLeads.filter(l => l.status === 'Completed').length,
        rating: 4.8
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated || user?.role !== 'provider') {
        router.push('/login');
      } else {
        fetchLeads();
      }
    }
  }, [mounted, authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!user?.business_id) return;
    const socketBaseUrl = process.env.NEXT_PUBLIC_SOCKET_URL
      || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
      || 'http://127.0.0.1:5000';
    const socket = io(socketBaseUrl);
    socket.emit('join_room', `business_${user.business_id}`);
    socket.on('new_rfq_lead', () => fetchLeads());
    socket.on('booking_status_updated', () => fetchLeads());
    return () => socket.disconnect();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    await leadService.updateLeadStatus(id, status);
    fetchLeads();
  };

  if (!mounted || authLoading || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-10">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
         <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Authenticating Provider Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-main min-h-screen flex">
      {/* 1. Slim Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 sticky top-0 h-screen hidden lg:flex flex-col p-8 z-30">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow text-white">
            <FiZap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tighter leading-none">LocalHub+</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Provider Console</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
           {[
             { label: 'Overview', ic: <FiGrid />, active: true },
             { label: 'Leads & Bookings', ic: <FiList />, active: false },
             { label: 'My Services', ic: <FiBriefcase />, active: false },
             { label: 'Settings', ic: <FiSettings />, active: false },
           ].map(item => (
             <motion.button 
               key={item.label}
               whileHover={{ x: 4 }}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                 item.active ? 'bg-primary text-white shadow-glow' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
             >
               {item.ic} {item.label}
             </motion.button>
           ))}
        </nav>

        <div className="pt-8 border-t border-slate-100">
           <button onClick={() => router.push('/logout')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all">
             <FiLogOut /> Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-6 shadow-subtle px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center">
             <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome, {user.name}</h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Ready to accept new jobs
               </p>
             </div>
             <div className="flex items-center gap-4">
               <motion.button whileHover={{ scale: 1.05 }} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-primary transition-all relative shadow-subtle">
                  <FiBell size={20} />
                  <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
               </motion.button>
               <motion.button whileHover={{ scale: 1.05 }} className="hidden md:flex bg-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg items-center gap-3">
                  <FiPlus /> New Service
               </motion.button>
             </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          
          {/* Quick Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Active Leads', count: stats.active, color: 'text-primary', bg: 'bg-white', border: 'border-slate-100' },
              { label: 'Completed Jobs', count: stats.completed, color: 'text-emerald-500', bg: 'bg-white', border: 'border-slate-100' },
              { label: 'Merchant Rating', count: `${stats.rating} ★`, color: 'text-amber-500', bg: 'bg-white', border: 'border-slate-100' },
            ].map(stat => (
              <motion.div 
                key={stat.label}
                whileHover={{ y: -4 }}
                className={`${stat.bg} p-8 rounded-[40px] border ${stat.border} text-center shadow-subtle`}
              >
                <div className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.count}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          {/* Leads Board */}
          <section className="bg-white rounded-[48px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                <FiZap className="text-primary" /> Recent Leads Box
              </h3>
              <div className="flex gap-2">
                <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/10">All Leads</button>
                <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100">Live (0)</button>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {leads.length === 0 ? (
                 <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-100">
                    <FiList size={48} className="text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-bold max-w-xs mx-auto">No job requests detected yet. Make sure your services are verified and active!</p>
                 </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {leads.map((lead, idx) => {
                      const isPending = lead.status === 'Pending';
                      return (
                        <motion.div 
                          key={lead.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle hover:shadow-premium transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                              <FiBriefcase size={24} />
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-2">{lead.service || 'Priority Service'}</h4>
                               <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                  <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-light" /> {lead.date}</span>
                                  <span className="flex items-center gap-1.5"><FiClock className="text-primary-light" /> {lead.time}</span>
                                  <span className="flex items-center gap-1.5"><FiMapPin className="text-primary-light" /> {lead.address}</span>
                               </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end gap-3">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              isPending ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {lead.status}
                            </div>
                            
                            {isPending && (
                              <div className="flex gap-2">
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleUpdateStatus(lead.id, 'Cancelled')}
                                  className="w-11 h-11 rounded-2xl bg-white border border-red-100 text-red-400 flex items-center justify-center hover:bg-red-50"
                                >
                                  <FiXCircle size={20} />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleUpdateStatus(lead.id, 'Accepted')}
                                  className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-glow flex items-center gap-2"
                                >
                                  Accept Job <FiArrowRight />
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>

          <footer className="mt-20 text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                LocalHub Provider Network &copy; {new Date().getFullYear()} — Secure Dashboard Access
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
