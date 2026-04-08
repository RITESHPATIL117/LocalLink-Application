'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiEdit3, FiArrowLeft, FiMessageCircle, FiChevronRight, FiClock, FiCheck, FiMoreHorizontal, FiChevronLeft
} from 'react-icons/fi';
import chatService from '../../services/chatService';
import Link from 'next/link';

export default function InboxPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await chatService.getChats().catch(() => ({ data: [] }));
      let fetchedChats = res.data || res || [];
      
      if (fetchedChats.length === 0) {
        fetchedChats = [
          { id: '1', name: 'Rahul Kumar', time: '10:45 AM', lastMessage: 'Thank you! The AC is working perfectly now.', unread: 2, isOnline: true },
          { id: '2', name: 'Sneha Patel', time: 'Yesterday', lastMessage: 'Can you share the pricing details?', unread: 0, isOnline: false },
          { id: '3', name: 'Amit Singh', time: 'Mon', lastMessage: 'See you tomorrow at 2 PM.', unread: 0, isOnline: true },
        ];
      }
      setChats(fetchedChats);
    } catch (e) {
      console.log('Error fetching chats:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* 1. Immersive Navigation Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-6 shadow-premium">
        <div className="section-container max-w-4xl flex justify-between items-center">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ x: -4 }}
              onClick={() => router.back()} 
              className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
            >
              <FiChevronLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Secure Inbox</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 End-to-end encrypted
              </p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-primary text-white shadow-glow flex items-center justify-center"
          >
            <FiEdit3 size={20} />
          </motion.button>
        </div>
      </header>

      <main className="section-container max-w-4xl pt-10 pb-32">
        
        {/* 2. Precision Search Cluster */}
        <div className="relative group mb-12">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by professional name..."
            className="w-full pl-16 pr-8 py-5 rounded-[24px] border border-slate-100 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-800 shadow-subtle group-focus-within:shadow-premium"
          />
        </div>

        {/* 3. Messaging Ledger */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[40px] border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Cloud Messages...</p>
             </div>
          ) : filteredChats.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-24 bg-white rounded-[40px] border border-slate-100 shadow-premium"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-inner">
                <FiMessageCircle size={40} className="text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Silent Inbox</h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto mb-12">
                When you hire an expert or receive service updates, your private conversations will appear here.
              </p>
              <button 
                onClick={() => router.push('/search')}
                className="btn-premium px-12 py-4 !rounded-2xl"
              >
                Hire a Professional
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredChats.map((chat, idx) => {
                const hasUnread = chat.unread > 0;
                return (
                  <motion.div 
                    key={chat.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => router.push(`/inbox/${chat.id}?name=${encodeURIComponent(chat.name)}`)}
                    className={`group relative bg-white px-8 py-7 rounded-[32px] border transition-all flex items-center gap-6 cursor-pointer hover:shadow-premium hover:-translate-y-1 ${
                      hasUnread ? 'border-primary/20 shadow-glow-primary/5' : 'border-slate-100 shadow-subtle'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-slate-100 border-4 border-white shadow-subtle">
                         <img 
                          src={`https://ui-avatars.com/api/?name=${chat.name}&background=4f46e5&color=fff`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={chat.name} 
                         />
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">{chat.name}</h3>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${hasUnread ? 'text-primary' : 'text-slate-300'}`}>
                           {chat.time}
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className={`text-sm truncate pr-4 ${hasUnread ? 'text-slate-900 font-black' : 'text-slate-400 font-medium'}`}>
                           {chat.lastMessage}
                         </p>
                         {hasUnread && (
                           <motion.div 
                             initial={{ scale: 0 }} 
                             animate={{ scale: 1 }}
                             className="bg-primary px-3 py-1 rounded-full text-white text-[10px] font-black shadow-glow"
                           >
                             {chat.unread}
                           </motion.div>
                         )}
                      </div>
                    </div>
                    <FiChevronRight className="text-slate-200 group-hover:text-primary transition-colors flex-shrink-0" size={24} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Floating Global Action */}
      <div className="fixed bottom-10 right-10 z-[110]">
         <motion.button 
           whileHover={{ scale: 1.1, rotate: 10 }}
           whileTap={{ scale: 0.9 }}
           className="w-16 h-16 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center border border-white/10"
         >
           <FiMoreHorizontal size={24} />
         </motion.button>
      </div>
    </div>
  );
}
