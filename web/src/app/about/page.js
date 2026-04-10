'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiHeart, FiShield, FiStar, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const stats = [
    { label: 'Verified Pros', value: '5,000+', icon: <FiUsers className="text-primary" /> },
    { label: 'Happy Customers', value: '50,000+', icon: <FiHeart className="text-red-500" /> },
    { label: 'Services Completed', value: '100k+', icon: <FiCheckCircle className="text-emerald-500" /> },
    { label: 'Cities Covered', value: '25+', icon: <FiTarget className="text-amber-500" /> },
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-slate-950">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" 
        />
        <div className="section-container relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest mb-8 shadow-glow">
              <FiStar className="text-amber-400" /> Elite Service Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight max-w-4xl mx-auto">
              Reimagining Local Services for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary">Modern World.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
              LocalHub is on a mission to organize the world&apos;s local services and make them accessible, 
              reliable, and highly professional for everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section Overlay */}
      <section className="-mt-20 relative z-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-premium flex flex-col justify-center text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 section-container">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pr-10"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
              Empowering Professionals. <br/>
              <span className="text-slate-400">Protecting Customers.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
              We empower local professionals by providing them with the high-tech tools and premium platform they need to scale their businesses. 
              Simultaneously, we give customers absolute peace of mind by rigorously vetting every single expert on our platform.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <FiShield />, title: 'Rigorous Background Checks', desc: 'Every provider undergoes a 5-point verification identity check.' },
                { icon: <FiTrendingUp />, title: 'Premium Business Growth', desc: 'Merchants on our platform see an average 300% increase in leads.' },
                { icon: <FiHeart />, title: 'Customer-First Support', desc: '24/7 dedicated concierges to handle any disputes or bookings.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-6 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="w-12 h-12 flex-shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl shadow-inner">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{feature.title}</h4>
                    <p className="text-sm font-semibold text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-emerald-400 rounded-[64px] blur-3xl opacity-20 transform -rotate-6" />
            <div className="relative rounded-[64px] overflow-hidden border-8 border-white shadow-premium">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200" 
                alt="LocalHub Elite Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Footer Section */}
      <section className="bg-white border-t border-slate-100 py-32 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-10 shadow-glow">
            <FiShield />
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8">Built on Absolute Trust</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
            Since 2024, LocalHub has been the ultimate bridge between high-quality talent and the people who need it. 
            We believe that premium, reliable local services are the backbone of a thriving digital community.
          </p>
          <div className="inline-flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:bg-primary transition-colors cursor-pointer">
            Explore The Platform
          </div>
        </div>
      </section>
      
    </div>
  );
}
