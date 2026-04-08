'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiZap, FiStar } from 'react-icons/fi';

const STEPS = [
  { 
    icon: <FiSearch />, 
    color: '#3B82F6', 
    title: 'Search', 
    desc: 'Find verified local service providers near you in seconds.' 
  },
  { 
    icon: <FiCalendar />, 
    color: '#10B981', 
    title: 'Book', 
    desc: 'Choose a time slot and confirm your booking instantly.' 
  },
  { 
    icon: <FiZap />, 
    color: '#F59E0B', 
    title: 'Get Served', 
    desc: 'Sit back while our professionals handle everything for you.' 
  },
  { 
    icon: <FiStar />, 
    color: '#EC4899', 
    title: 'Rate & Review', 
    desc: 'Share your experience to help the community grow.' 
  },
];

export default function HowItWorks() {
  return (
    <section className="mt-32 pt-32 border-t border-slate-200/60 pb-20">
      <div className="section-container">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">How It Works</h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Experience seamless local service booking in 4 easy steps</p>
        </div>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-slate-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative">
            {STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center group"
              >
                <div 
                  className="w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-4xl shadow-subtle group-hover:shadow-premium group-hover:scale-110 transition-all duration-500 relative z-10 bg-white border border-slate-50"
                  style={{ color: step.color }}
                >
                  <div 
                    className="absolute inset-4 rounded-2xl opacity-10"
                    style={{ backgroundColor: step.color }}
                  />
                  <div className="relative z-10">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed px-4">{step.desc}</p>
                
                {/* Step Number Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-4 border-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  0{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
