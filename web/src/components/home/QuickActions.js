'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiBriefcase, FiClipboard, FiHeadphones } from 'react-icons/fi';
import Link from 'next/link';

const ACTIONS = [
  { 
    title: 'Book Service', 
    icon: <FiCalendar />, 
    color: '#4F46E5', 
    path: '/categories',
    desc: 'Verified professionals'
  },
  { 
    title: 'List Business', 
    icon: <FiBriefcase />, 
    color: '#06B6D4', 
    path: '/register?role=provider',
    desc: 'Reach more customers'
  },
  { 
    title: 'My Bookings', 
    icon: <FiClipboard />, 
    color: '#F59E0B', 
    path: '/requests',
    desc: 'Manage your leads'
  },
  { 
    title: 'Get Support', 
    icon: <FiHeadphones />, 
    color: '#EC4899', 
    path: '/support',
    desc: '24/7 help center'
  },
];

export default function QuickActions() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACTIONS.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={action.path}
              className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-primary/10 hover:shadow-md transition-all duration-300 group h-full"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 shadow-subtle group-hover:shadow-glow"
                style={{ backgroundColor: `${action.color}10`, color: action.color }}
              >
                {action.icon}
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">{action.title}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
