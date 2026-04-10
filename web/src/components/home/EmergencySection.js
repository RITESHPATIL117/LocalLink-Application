'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiZap, FiWind, FiTruck, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

const EMERGENCIES = [
  { name: 'Plumber', icon: <FiDroplet />, color: '#EF4444', path: '/categories?q=Plumber' },
  { name: 'Electrician', icon: <FiZap />, color: '#F59E0B', path: '/categories?q=Electrician' },
  { name: 'AC Repair', icon: <FiWind />, color: '#3B82F6', path: '/categories?q=AC' },
  { name: 'Car Help', icon: <FiTruck />, color: '#10B981', path: '/categories?q=Car' },
];

export default function EmergencySection() {
  return (
    <section className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center animate-pulse shadow-sm">
            <FiAlertCircle size={22} />
          </div>
          <h3 className="section-heading">QuickFix Emergencies</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
           <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live SOS Support</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {EMERGENCIES.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={item.path}
              className="flex items-center gap-3 px-4 md:px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm hover:border-red-100 hover:shadow-md transition-all group"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform group-hover:rotate-12"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <span className="text-sm font-black text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
