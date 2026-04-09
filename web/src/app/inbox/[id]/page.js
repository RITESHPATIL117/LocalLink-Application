'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiMoreVertical, FiPaperclip, FiSend, FiCheck, FiCheckCircle, FiClock, FiShield, FiChevronLeft
} from 'react-icons/fi';
import chatService from '../../../services/chatService';

export default function ChatDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const chatId = pathname?.split('/').filter(Boolean).pop();
  const [chatName, setChatName] = useState('Elite Specialist');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setChatName(urlParams.get('name') || 'Elite Specialist');
    }
  }, [pathname]);

  useEffect(() => {
    // Initial fetch of messages mock
    setMessages([
      { id: '1', text: 'Hello, are you available today for a plumbing leak?', sender: 'other', time: '10:30 AM', status: 'read' },
      { id: '2', text: 'Yes, I can come by at around 2 PM to assess the damage.', sender: 'me', time: '10:35 AM', status: 'read' },
      { id: '3', text: 'That works great! I have the parts ready in the garage.', sender: 'other', time: '10:40 AM', status: 'read' },
    ]);
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-bg-main h-screen flex flex-col overflow-hidden">
      
      {/* 1. Precision Chat Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 px-6 z-[100] shadow-premium">
        <div className="section-container max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <motion.button 
              whileHover={{ x: -4 }}
              onClick={() => router.back()} 
              className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
            >
              <FiChevronLeft size={24} />
            </motion.button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-subtle bg-slate-100">
                  <img src={`https://ui-avatars.com/api/?name=${chatName}&background=4f46e5&color=fff`} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{chatName}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Active Now</span>
                </div>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
          >
            <FiMoreVertical size={20} />
          </motion.button>
        </div>
      </header>

      {/* 2. Chat Canvas */}
      <div className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div className="section-container max-w-4xl py-12 px-6">
          
          <div className="flex flex-col items-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/50 border border-slate-100 px-5 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
               <FiShield size={14} className="text-emerald-500" /> Secure Encryption Active
            </div>
            <p className="text-[10px] text-slate-300 font-bold mt-4 uppercase tracking-[0.1em]">CONVERSATION ESTABLISHED MARCH 2024</p>
          </div>

          <div className="flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div 
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                     <div className={`max-w-[80%] md:max-w-[70%] px-6 py-4 rounded-[32px] shadow-subtle ${
                       isMe 
                        ? 'bg-slate-900 text-white rounded-br-lg' 
                        : 'bg-white text-slate-800 border border-slate-50 rounded-bl-lg'
                     }`}>
                        <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                     </div>
                     <div className={`mt-3 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.time} 
                        {isMe && (
                          <FiCheckCircle className={msg.status === 'read' ? 'text-primary' : 'text-slate-200'} size={14} />
                        )}
                     </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </div>

      {/* 3. Elite Composition Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200 p-6 z-[100]">
        <div className="section-container max-w-4xl">
           <div className="flex items-end gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all flex-shrink-0"
              >
                <FiPaperclip size={22} />
              </motion.button>
              
              <div className="flex-grow flex items-end gap-4 bg-slate-50 rounded-3xl border border-slate-100 p-2.5 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                <textarea 
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Draft your secure message..."
                  className="flex-grow bg-transparent border-none outline-none pl-4 py-3 text-slate-800 font-semibold text-[15px] resize-none min-h-[48px] max-h-[120px] no-scrollbar"
                />
                <motion.button 
                  disabled={!message.trim()}
                  whileHover={message.trim() ? { scale: 1.05 } : {}}
                  whileTap={message.trim() ? { scale: 0.95 } : {}}
                  onClick={handleSend}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-glow-primary ${
                    message.trim() 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <FiSend size={22} />
                </motion.button>
              </div>
           </div>
           <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
             LOCAL-HUB END-TO-END SECURE CHANNEL
           </p>
        </div>
      </footer>
    </div>
  );
}
