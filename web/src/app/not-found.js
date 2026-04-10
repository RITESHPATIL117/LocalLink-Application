'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiAlertCircle, FiChevronRight } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="bg-bg-main min-h-screen flex items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Decorative background pulse */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white p-12 md:p-20 rounded-[64px] shadow-premium border border-slate-100 relative z-10"
      >
        <div className="relative mb-16">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            <FiAlertCircle size={100} className="text-primary/20" />
          </motion.div>
          <h1 className="text-[160px] md:text-[200px] font-black text-slate-50 absolute inset-0 flex items-center justify-center -z-10 tracking-tighter select-none">
            404
          </h1>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 underline decoration-primary/20 decoration-8 underline-offset-8">
          Lost in the Hub?
        </h2>
        <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed max-w-md mx-auto">
          The expert service you&apos;re looking for might have moved, or the link has expired. 
          Don&apos;t worry, we&apos;ll help you find your way back.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <Link href="/" className="flex-1 group">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-slate-900 text-white p-6 rounded-[28px] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.2em] shadow-2xl group-hover:bg-primary transition-all"
            >
              <FiHome size={20} />
              Return Home
            </motion.div>
          </Link>
          <Link href="/search" className="flex-1 group">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-slate-50 text-slate-600 p-6 rounded-[28px] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.2em] border border-slate-100 group-hover:bg-white group-hover:border-primary/20 transition-all"
            >
              <FiSearch size={20} />
              Search Services
            </motion.div>
          </Link>
        </div>

        <div className="pt-10 border-t border-slate-50">
          <p className="text-slate-400 font-bold text-sm">
            Need immediate assistance? 
            <Link href="/support" className="text-primary ml-2 inline-flex items-center gap-2 group">
              Contact Support <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Absolute Decorative Circles */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
    </div>
  );
}
