'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import businessService from '../../services/businessService';
import BusinessCard from '../BusinessCard';

export default function FeaturedSection() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await businessService.getAllBusinesses({ featured: true });
        setBusinesses(res.data || []);
      } catch (err) {
        console.error('Failed to fetch featured businesses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="mb-12 md:mb-16">
        <div className="h-8 w-64 skeleton mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[400px] rounded-[32px] skeleton" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 md:mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">Top Rated Professionals</h2>
          <p className="text-sm md:text-base text-text-muted mt-2">Verified experts in Sangli with stellar reviews</p>
        </div>
        <button 
          onClick={() => router.push('/search')}
          className="text-primary font-semibold hover:underline flex items-center gap-2 group"
        >
          Explore All Marketplace <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
      >
        {businesses.map((biz, idx) => (
          <motion.div
            key={biz.id}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <BusinessCard business={biz} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
