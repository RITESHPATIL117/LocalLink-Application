'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { renderDynamicIcon } from '../../utils/iconHelper';
import categoryService from '../../services/categoryService';
import businessService from '../../services/businessService';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getCategories();
        const mainCats = (res.data || []).filter(cat => !cat.parent_id);
        setCategories(mainCats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchTopBusinesses() {
      try {
        const res = await businessService.getAllBusinesses({ featured: true });
        const rows = (res?.data || []).slice(0, 8);
        setTopBusinesses(rows);
      } catch (err) {
        console.error('Failed to fetch top businesses:', err);
      }
    }
    fetchTopBusinesses();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="mb-12 md:mb-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full skeleton" />
            <div className="w-16 h-4 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mb-10 md:mb-14">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6 md:mb-8">
        <div>
          <h2 className="section-heading">Browse by Category</h2>
          <p className="section-description mt-1.5">Verified local services in Sangli, Maharashtra</p>
        </div>
        <button 
          onClick={() => router.push('/categories')}
          className="group flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2 transition-all btn-ui"
        >
          View All Categories <span className="text-base">→</span>
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            onClick={() => router.push(`/categories?id=${cat.id}`)}
            className="flex flex-col items-center group cursor-pointer h-full"
          >
            <div 
              className="w-20 h-20 md:w-22 md:h-22 rounded-full bg-white border border-slate-100 shadow-subtle group-hover:shadow-premium flex items-center justify-center transition-all duration-500 overflow-hidden relative"
            >
              {/* Subtle gradient bg overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ backgroundColor: cat.color || 'var(--primary)' }}
              />
              <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10 flex items-center justify-center">
                {renderDynamicIcon(cat.icon, 30, cat.color || 'var(--primary)')}
              </div>
            </div>
            <span className="mt-3.5 text-xs md:text-sm font-black text-slate-500 group-hover:text-primary transition-colors text-center px-1 tracking-tight leading-tight">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 md:mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-base font-bold text-slate-900">Popular Businesses</h3>
          <button
            onClick={() => router.push('/search')}
            className="text-xs md:text-sm text-primary font-semibold"
          >
            View All
          </button>
        </div>

        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
          {topBusinesses.map((biz, idx) => {
            const imageSrc = (biz.image_url && biz.image_url.length > 10)
              ? biz.image_url
              : (biz.image && biz.image.length > 10)
                ? biz.image
                : `https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&sig=${idx}`;

            return (
              <button
                key={biz.id || idx}
                onClick={() => router.push(`/business/${biz.id}`)}
                className="snap-start shrink-0 basis-[calc((100%-0.75rem)/2)] sm:basis-[calc((100%-1.5rem)/3)] lg:basis-[calc((100%-2.25rem)/4)] bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all text-left overflow-hidden"
              >
                <img src={imageSrc} alt={biz.name} className="w-full h-24 md:h-28 object-cover" />
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-bold">
                    {biz.category_name || 'Service'}
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                    {biz.name || 'Business Partner'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {biz.address || 'Sangli, Maharashtra'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
