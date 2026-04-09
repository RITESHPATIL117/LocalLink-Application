'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import leadService from '../services/leadService';

// Modular Home Components
import HeroSection from '../components/home/HeroSection';
import QuickActions from '../components/home/QuickActions';
import EmergencySection from '../components/home/EmergencySection';
import OffersSection from '../components/home/OffersSection';
import CategoryGrid from '../components/home/CategoryGrid';
import TrendingSection from '../components/home/TrendingSection';
import FeaturedSection from '../components/home/FeaturedSection';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isAuthenticated) {
      leadService.getUserLeads().then(res => {
        const active = (res.data || []).filter(l => l.status === 'pending' || l.status === 'contacted').length;
        setActiveBookingsCount(active);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!hasMounted) return null;

  return (
    <div className="bg-bg-main min-h-screen">
      
      {/* 
          Main Content Wrapper 
          Using modular components assembled into a premium layout.
          Horizontal spacing handled by components internal .section-container classes
      */}
      <main className="pb-16 md:pb-24">
        
        {/* Welcome & Dashboard Lite */}
        <section className="section-container pt-8 md:pt-10 mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                {greetingText()}{isAuthenticated && user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
              </h1>
              <p className="text-slate-500 mt-3 font-medium text-lg">
                What service can we help you find today?
              </p>
            </motion.div>

            {activeBookingsCount > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 border border-emerald-100 px-8 py-3.5 rounded-full flex items-center gap-4 shadow-subtle"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black text-emerald-700 tracking-[0.15em] uppercase">
                  {activeBookingsCount} ACTIVE BOOKINGS
                </span>
              </motion.div>
            )}
          </div>
        </section>

        {/* Hero Section Carousel */}
        <HeroSection />

        <div className="section-container">
          {/* Dashboard Quick Actions */}
          <QuickActions />

          {/* Critical Emergency Section */}
          <EmergencySection />

          {/* Promotion & Offers Grid */}
          <OffersSection />

          {/* Main Service Categories */}
          <CategoryGrid />

          {/* Trending Keywords / Micro-Categories */}
          <TrendingSection />
        </div>

        {/* Business Partner CTA (Professional Grade) */}
        <section className="mb-12 md:mb-16">
          <div className="section-container">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-slate-950 rounded-3xl p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-premium"
            >
              <div className="relative z-10 max-w-2xl">
                <div className="bg-primary/20 backdrop-blur-md px-5 py-2 rounded-2xl inline-block mb-8 border border-white/5">
                  <span className="text-primary-light font-black text-[10px] tracking-[0.2em] uppercase">Pro Network</span>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter">
                  Scale your local business <br/> to new heights
                </h3>
                <p className="text-white/60 text-base md:text-lg lg:text-xl font-medium mb-8 md:mb-12 leading-relaxed">
                  Join 5,000+ local providers in Sangli. Get verified leads, 
                  manage bookings, and grow your revenue by 3x.
                </p>
                <button 
                  onClick={() => window.location.href = '/register?role=provider'}
                  className="btn-premium px-12 py-5 !rounded-[24px] text-lg hover-lift"
                >
                  Register Your Business <FiArrowRight className="ml-2" />
                </button>
              </div>
              
              {/* Background Art */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
              <FiShield size={400} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12" />
            </motion.div>
          </div>
        </section>

        {/* Featured Service Providers */}
        <div className="section-container">
          <FeaturedSection />
        </div>

        {/* Informational & Social Sections */}
        <HowItWorks />
        
        <Testimonials />

        {/* Final Trust Stats Section */}
        <section className="section-container mb-12 md:mb-16">
           <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-subtle grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
              <div>
                <p className="text-5xl font-black text-primary mb-3 tracking-tighter">50K+</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Verified Users</p>
              </div>
              <div>
                <p className="text-5xl font-black text-primary mb-3 tracking-tighter">1.2K</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Partner Pros</p>
              </div>
              <div>
                <p className="text-5xl font-black text-primary mb-3 tracking-tighter">24/7</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Swift Support</p>
              </div>
              <div>
                <p className="text-5xl font-black text-primary mb-3 tracking-tighter">4.9/5</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Customer Rating</p>
              </div>
           </div>
        </section>

      </main>

      <style jsx global>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
