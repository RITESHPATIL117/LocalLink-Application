'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiGift, FiArrowRight } from 'react-icons/fi';

const OFFERS = [
  {
    title: 'Summer Special 🔥',
    subtitle: '20% off on AC Repair & Plumbing',
    code: 'SUMMER20',
    color: 'from-orange-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600'
  },
  {
    title: 'New Home Bundle 🏠',
    subtitle: 'Flat ₹500 off on first deep cleaning',
    code: 'NEW500',
    color: 'from-blue-600 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600'
  }
];

export default function OffersSection() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {OFFERS.map((offer, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-md group cursor-pointer h-[260px] md:h-[300px] bg-gradient-to-br ${offer.color}`}
          >
            {/* Background Image with Overlay */}
            <img 
              src={offer.image} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700" 
              alt={offer.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 mb-6">
                  <FiGift className="text-white" />
                  <span className="text-white font-black text-[10px] tracking-widest uppercase">Limited Offer</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{offer.title}</h3>
                <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed max-w-sm">{offer.subtitle}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">Use Code</span>
                  <span className="text-white font-black text-xl tracking-tighter">{offer.code}</span>
                </div>
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
                  <FiArrowRight size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
