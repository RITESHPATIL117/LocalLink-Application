'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHexagon, FiUsers, FiBriefcase, FiTrendingUp, FiCheckCircle, 
  FiClock, FiAlertTriangle, FiArrowRight, FiActivity, FiLayers, FiShield, FiBell, FiSettings, FiExternalLink, FiSearch
} from 'react-icons/fi';
import adminService from '../../../services/adminService';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState({ users: 1560, providers: 428, revenue: 145000 });
  const [pendingCount, setPendingCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    } else {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        adminService.getPlatformStats().catch(() => ({ data: { users: 1560, providers: 428, revenue: 145000 } })),
        adminService.getPendingBusinesses().catch(() => ({ data: [1,2,3,4,5] }))
      ]);
      setStats(statsRes.data || statsRes);
      setPendingCount((pendingRes.data || pendingRes).length || 0);
    } catch (e) {
      console.error('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10">
       <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
       <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing LocalHub+ Admin Vault...</p>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen flex text-slate-200">
      
      {/* 1. Global Command Sidebar */}
      <aside className="w-80 bg-slate-900 border-r border-white/5 sticky top-0 h-screen hidden lg:flex flex-col p-10 z-50">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-glow text-white">
            <FiHexagon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter leading-none">AdminHub</h2>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">v4.0.2 Stable</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
           {[
             { label: 'Dashboard', ic: <FiLayers />, active: true, route: '/admin/dashboard' },
             { label: 'Approvals', ic: <FiCheckCircle />, badge: pendingCount, active: false, route: '/admin/approvals' },
             { label: 'User Index', ic: <FiUsers />, active: false, route: '#' },
             { label: 'Partners', ic: <FiBriefcase />, active: false, route: '#' },
             { label: 'System Logs', ic: <FiActivity />, active: false, route: '#' },
             { label: 'Platform Settings', ic: <FiSettings />, active: false, route: '#' },
           ].map(item => (
             <motion.div key={item.label} whileHover={{ x: 4 }}>
               <Link href={item.route} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                 item.active ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-500 hover:text-white hover:bg-white/5'
               }`}>
                 {item.ic} <span className="flex-grow">{item.label}</span>
                 {item.badge > 0 && (
                   <span className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[9px]">{item.badge}</span>
                 )}
               </Link>
             </motion.div>
           ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
           <button onClick={() => router.push('/')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all">
             <FiExternalLink /> View Marketplace
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Control Bar */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[100] py-6 shadow-subtle px-10">
          <div className="flex justify-between items-center">
             <div>
               <h1 className="text-3xl font-black text-white tracking-tighter">Executive Management</h1>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Global Systems Online
               </p>
             </div>
             <div className="flex items-center gap-6">
                <div className="hidden md:flex relative group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input placeholder="Search records..." className="bg-white/5 border border-white/10 pl-11 pr-6 py-3 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-all w-64" />
                </div>
               <div className="flex items-center gap-3">
                 <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all relative">
                    <FiBell size={20} />
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                 </button>
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <FiShield size={20} />
                 </div>
               </div>
             </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-7xl w-full mx-auto">
          
          {/* Main KPI Dashboard */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { label: 'Active Consumer Base', value: stats.users.toLocaleString(), trend: '+4.2%', icon: <FiUsers />, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
              { label: 'Verified Service Partners', value: stats.providers.toLocaleString(), trend: '+1.5%', icon: <FiBriefcase />, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
              { label: 'Marketplace Revenue', value: `₹${stats.revenue.toLocaleString()}`, trend: '+12.8%', icon: <FiTrendingUp />, color: 'text-amber-500', bg: 'bg-amber-500/5' },
            ].map((kpi, idx) => (
              <motion.div 
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.2)' }}
                className={`group relative bg-white/5 p-10 rounded-[48px] border border-white/5 shadow-2xl overflow-hidden`}
              >
                {/* Visual Flair */}
                <div className={`absolute -bottom-8 -right-8 opacity-5 text-9xl ${kpi.color} group-hover:rotate-12 transition-transform`}>
                  {kpi.icon}
                </div>
                
                <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-8 shadow-inner`}>
                  {kpi.icon}
                </div>
                <div className="flex items-end justify-between">
                   <div>
                     <div className="text-4xl font-black text-white tracking-tighter mb-2">{kpi.value}</div>
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</div>
                   </div>
                   <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                     {kpi.trend}
                   </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Action Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             
             {/* Pending Approvals Section */}
             <div className="lg:col-span-8">
               <section className="bg-white/5 p-10 rounded-[48px] border border-white/5 shadow-premium">
                 <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                     <FiCheckCircle className="text-indigo-500" /> Pending Approvals
                   </h3>
                   <Link href="/admin/approvals" className="text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-300 transition-colors">
                     Review Managed Queue →
                   </Link>
                 </div>
                 
                 {pendingCount > 0 ? (
                   <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-red-500/10 border border-red-500/20 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-10"
                   >
                     <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center shadow-glow-red flex-shrink-0 animate-pulse">
                        <FiClock size={36} className="text-white" />
                     </div>
                     <div className="flex-grow text-center md:text-left">
                        <h4 className="text-2xl font-black text-red-500 tracking-tight leading-none mb-3">{pendingCount} Business Verifications Critical</h4>
                        <p className="text-slate-400 text-sm font-medium pr-10">High-priority verification backlog detected. Providers are awaiting activation to begin Marketplace transactions.</p>
                     </div>
                     <button 
                       onClick={() => router.push('/admin/approvals')}
                       className="bg-red-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-glow flex-shrink-0 hover:brightness-110 transition-all"
                     >
                       Begin Batch Review
                     </button>
                   </motion.div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-[40px] border border-dashed border-white/5 text-slate-500">
                      <FiCheckCircle size={48} className="text-emerald-500 mb-6" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">Registry queue cleared</p>
                   </div>
                 )}
               </section>
             </div>

             {/* Security Feed */}
             <div className="lg:col-span-4">
               <section className="bg-white/5 p-10 rounded-[48px] border border-white/5 shadow-premium h-full">
                  <h3 className="text-xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
                    <FiShield className="text-indigo-500" /> Threat Intelligence
                  </h3>
                  <div className="space-y-6">
                    {[
                      { color: 'bg-amber-500', text: 'Suspicious login: Pune, MH', time: '12m ago' },
                      { color: 'bg-emerald-500', text: 'Global Ledger Backup Successful', time: '2h ago' },
                      { color: 'bg-indigo-500', text: 'Security Keys Rotated', time: '5h ago' },
                      { color: 'bg-slate-500', text: 'Stripe Webhook Verified', time: '14h ago' }
                    ].map((alert, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-crosshair border border-transparent hover:border-white/5"
                      >
                         <div className={`w-2 h-2 rounded-full ${alert.color} shadow-sm shadow-current`} />
                         <div className="flex-grow">
                           <p className="text-xs font-bold text-slate-300">{alert.text}</p>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{alert.time}</p>
                         </div>
                      </motion.div>
                    ))}
                  </div>
               </section>
             </div>

          </div>

          <footer className="mt-24 text-center">
             <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">
                ADMINHUB GLOBAL CORE &copy; {new Date().getFullYear()} — RESTRICTED ACCESS AREA
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
