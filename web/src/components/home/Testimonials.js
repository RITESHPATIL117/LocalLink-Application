'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser } from 'react-icons/fi';

const TESTIMONIALS = [
  {
    name: 'John Sharma',
    service: 'Home Deep Cleaning',
    rating: 5,
    text: '“LocalHub found me the best cleaning crew I’ve ever used. The process was seamless and the results were incredible. Highly recommended!”',
    avatar: 'https://ui-avatars.com/api/?name=JS&background=6366F1&color=fff'
  },
  {
    name: 'Priya Patil',
    service: 'Salon at Home',
    rating: 5,
    text: '“I was hesitant to book salon services at home, but LocalHub verified professionals were amazing. Safe, professional, and very convenient.”',
    avatar: 'https://ui-avatars.com/api/?name=PP&background=EC4899&color=fff'
  },
  {
    name: 'Rahul Deshmukh',
    service: 'AC Repair',
    rating: 4,
    text: '“My AC broke down in peak summer. Found a technician within 10 minutes on LocalHub. Fixed the issue in an hour. Great service!”',
    avatar: 'https://ui-avatars.com/api/?name=RD&background=06B6D4&color=fff'
  }
];

export default function Testimonials() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14 gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">What Customers Say <span className="text-amber-400">★</span></h2>
            <p className="text-sm md:text-base text-slate-500">Join 50,000+ happy customers in Sangli using LocalHub</p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 italic font-medium text-slate-500 text-sm">
             "The Trustworthy Choice for Home Services"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-6 md:p-8 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} className="text-amber-400" fill="currentColor" size={18} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium italic mb-8">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-base">{t.name}</h4>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{t.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
