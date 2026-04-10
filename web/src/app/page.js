'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import leadService from '../services/leadService';
import businessService from '../services/businessService';

// Modular Home Components
import HeroSection from '../components/home/HeroSection';
import ServiceHighlights from '../components/home/ServiceHighlights';
import QuickActions from '../components/home/QuickActions';
import EmergencySection from '../components/home/EmergencySection';
import OffersSection from '../components/home/OffersSection';
import CategoryGrid from '../components/home/CategoryGrid';
import TrendingSection from '../components/home/TrendingSection';
import FeaturedSection from '../components/home/FeaturedSection';
import HowItWorks from '../components/home/HowItWorks';

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    happyCustomers: 0,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    businessService
      .getPublicStats()
      .then((res) => {
        const data = res?.data || {};
        setPlatformStats({
          totalUsers: data.totalUsers || 50000,
          totalBusinesses: data.totalBusinesses || 1200,
          happyCustomers: data.happyCustomers || 49000,
        });
      })
      .catch(() => {
        setPlatformStats({ totalUsers: 50000, totalBusinesses: 1200, happyCustomers: 49000 });
      });
  }, [hasMounted]);

  useEffect(() => {
    if (!hasMounted || !isAuthenticated) {
      setActiveBookingsCount(0);
      return;
    }
    leadService
      .getUserLeads()
      .then((res) => {
        const active = (res?.data || []).filter((l) => l.status === 'pending' || l.status === 'contacted').length;
        setActiveBookingsCount(active);
      })
      .catch(() => setActiveBookingsCount(0));
  }, [hasMounted, isAuthenticated]);

  if (!hasMounted) return null;

  return (
    <div className="bg-bg-main min-h-screen">
      
      {/* 
          Main Content Wrapper 
          Using modular components assembled into a premium layout.
          Horizontal spacing handled by components internal .section-container classes
      */}
      <main className="pb-12 md:pb-16">
        <section className="section-container pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {activeBookingsCount > 0 ? (
              <button
                onClick={() => (window.location.href = '/requests')}
                className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-xs font-black text-emerald-700 uppercase tracking-[0.12em]"
              >
                {activeBookingsCount} Active Bookings
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-semibold">No active bookings</span>
            )}
          </div>
        </section>

        {/* Hero Section Carousel */}
        <HeroSection />

        <div className="section-container">
          <ServiceHighlights />
        </div>

        <div className="section-container">
          {/* Dashboard Quick Actions */}
          <QuickActions />

          {/* Main Service Categories */}
          <CategoryGrid />

          {/* Promotion & Offers Grid */}
          <OffersSection />

          {/* Critical Emergency Section */}
          <EmergencySection />

          {/* Trending Keywords / Micro-Categories */}
          <TrendingSection />

          {/* Featured Service Providers */}
          <FeaturedSection />
        </div>

        {/* Informational Section */}
        <HowItWorks />

        {/* Business Partner CTA (Professional Grade) */}
        <section className="mb-10 md:mb-14">
          <div className="section-container">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-slate-950 rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden shadow-premium"
            >
              <div className="relative z-10 max-w-xl">
                <div className="bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-xl inline-block mb-5 border border-white/5">
                  <span className="text-primary-light font-black text-[10px] tracking-[0.2em] uppercase">Pro Network</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 md:mb-5 leading-[1.1] tracking-tighter">
                  Scale your local business
                </h3>
                <p className="text-white/70 text-sm md:text-base font-medium mb-6 md:mb-8 leading-relaxed">
                  Join 5,000+ local providers in Sangli. Get verified leads, 
                  manage bookings, and grow your revenue by 3x.
                </p>
                <button 
                  onClick={() => window.location.href = '/register?role=provider'}
                  className="btn-premium px-6 py-3 !rounded-full text-sm md:text-base hover-lift"
                >
                  Register Your Business <FiArrowRight className="ml-2" />
                </button>
              </div>
              
              {/* Background Art */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
              <FiShield size={280} className="absolute -right-12 -bottom-12 text-white/[0.03] rotate-12" />
            </motion.div>
          </div>
        </section>

        {/* Final Trust Stats Section */}
        <section className="section-container mb-10 md:mb-14">
           <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-subtle grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tighter">50K+</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Verified Users</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tighter">1.2K</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Partner Pros</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tighter">24/7</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Swift Support</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-primary mb-2 tracking-tighter">4.9/5</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Customer Rating</p>
              </div>
           </div>
        </section>

        <section className="section-container mb-10 md:mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900">{platformStats.totalUsers.toLocaleString()}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Users</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900">{platformStats.totalBusinesses.toLocaleString()}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Businesses</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900">{platformStats.happyCustomers.toLocaleString()}+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Happy Customers</p>
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
