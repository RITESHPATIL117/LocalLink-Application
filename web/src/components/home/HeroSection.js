'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiPlay } from 'react-icons/fi';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200',
    tag: 'Elite Deep Cleaning',
    title: 'Professional Home Deep Cleaning',
    desc: 'Transform your home with verified experts. safe, secure, and sparkling clean starting from ₹999.',
    color: '#4F46E5',
    cta: 'Book Now'
  },
  {
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200',
    tag: 'Certified Electrical Support',
    title: 'Reliable Electrical Support',
    desc: 'Instant response from licensed technicians. Zero consultation fees for your doorstep service.',
    color: '#06B6D4',
    cta: 'Get Help'
  },
  {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200',
    tag: 'Beauty & Grooming',
    title: 'Premium Salon at Home',
    desc: 'Top-rated stylists with 4.9+ star ratings across Sangli. Pamper yourself today.',
    color: '#EC4899',
    cta: 'View Services'
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-6 md:mt-8 mb-12 md:mb-16 overflow-hidden">
      <div className="section-container">
        <div className="relative h-[320px] sm:h-[380px] md:h-[430px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-950 group">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 shadow-inner"
            >
              <img
                src={SLIDES[current].image} 
                alt={SLIDES[current].title}
                className="w-full h-full object-cover"
              />
              {/* Complex Gradients for Premium Look */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Content Wrapper (Split Layout Grid) */}
          <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 items-center px-5 sm:px-8 md:px-12 lg:px-16 py-6 md:py-10">
            <motion.div
              key={`content-${current}`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-xl z-20"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 mb-4 md:mb-6">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(79,70,229,0.5)] animate-pulse" />
                <span className="text-white font-black text-[10px] tracking-[0.2em] uppercase">{SLIDES[current].tag}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-[1.05] tracking-tighter">
                {SLIDES[current].title}
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-white/70 font-medium mb-6 md:mb-10 leading-relaxed max-w-lg">
                {SLIDES[current].desc}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                <button className="btn-premium px-6 sm:px-8 py-3 sm:py-4 !rounded-full text-sm md:text-base hover-lift group">
                  {SLIDES[current].cta} 
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="hidden sm:flex items-center gap-4 text-white font-bold group">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
                    <FiPlay fill="currentColor" />
                  </div>
                  <span className="text-sm tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">Watch Demo</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Navigation Dots (Right Side Vertical) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-30">
             {SLIDES.map((_, idx) => (
               <button
                 key={idx}
                 onClick={() => setCurrent(idx)}
                 className={`transition-all duration-500 rounded-full border border-white/20 ${
                   current === idx ? 'h-10 w-2.5 bg-white border-white' : 'h-2.5 w-2.5 hover:bg-white/40'
                 }`}
               />
             ))}
          </div>

          {/* Slider Count Indicator */}
          <div className="absolute bottom-6 left-8 hidden md:flex items-center gap-4 z-30">
            <span className="text-white text-3xl font-black italic opacity-20">0{current + 1}</span>
            <div className="h-[2px] w-20 bg-white/10 overflow-hidden rounded-full">
              <motion.div 
                key={`progress-${current}`}
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 8, ease: 'linear' }}
                className="h-full bg-primary"
              />
            </div>
            <span className="text-white text-sm font-black opacity-20">0{SLIDES.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
