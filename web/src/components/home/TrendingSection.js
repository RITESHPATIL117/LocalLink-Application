'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiZap, FiSettings, FiDroplet, FiStar } from 'react-icons/fi';

const TRENDING = [
  { name: 'AC Repair', icon: <FiZap /> },
  { name: 'Pipe Repair', icon: <FiDroplet /> },
  { name: 'Deep Cleaning', icon: <FiStar /> },
  { name: 'Electrical Hub', icon: <FiSettings /> },
  { name: 'Bridal Makeup', icon: <FiStar /> },
  { name: 'Home Painting', icon: <FiTrendingUp /> },
];

export default function TrendingSection() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-center gap-3 mb-8">
        <FiTrendingUp className="text-primary text-2xl" />
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Trending Now</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {TRENDING.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.05 }}
            className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-white border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="text-primary group-hover:rotate-12 transition-transform">
              {item.icon}
            </span>
            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
