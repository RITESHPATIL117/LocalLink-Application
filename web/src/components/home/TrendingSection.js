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
    <section className="mb-10 md:mb-14">
      <div className="flex items-center gap-2.5 mb-6">
        <FiTrendingUp className="text-primary text-xl" />
        <h3 className="section-heading">Trending Now</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {TRENDING.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.05 }}
            className="flex items-center gap-2.5 px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-white border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="text-primary group-hover:rotate-12 transition-transform">
              {item.icon}
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
