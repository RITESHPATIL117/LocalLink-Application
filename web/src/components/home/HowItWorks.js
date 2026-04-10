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
    <section className="mt-10 md:mt-14 pt-10 md:pt-14 border-t border-slate-200/60 pb-10 md:pb-14">
      <div className="section-container">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-heading mb-3">How It Works</h2>
          <p className="section-description max-w-2xl mx-auto">Experience seamless local service booking in 4 easy steps</p>
        </div>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-slate-100" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative">
            {STEPS.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group h-full"
              >
                <div className="h-full rounded-2xl bg-white border border-slate-100 p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center">
                  <div 
                    className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center mb-4 text-2xl md:text-3xl shadow-subtle group-hover:shadow-premium group-hover:scale-105 transition-all duration-300 relative z-10"
                    style={{ color: step.color, backgroundColor: `${step.color}12` }}
                  >
                    <div className="relative z-10">
                      {step.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
                  <div className="mt-4 text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                    Step 0{idx + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
