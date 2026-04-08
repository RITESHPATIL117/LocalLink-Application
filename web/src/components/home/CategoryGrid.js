'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { renderDynamicIcon } from '../../utils/iconHelper';
import categoryService from '../../services/categoryService';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
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
      <div className="mb-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
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
    <section className="mb-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
          <p className="text-slate-500 mt-2 font-medium">Verified local services in Sangli, Maharashtra</p>
        </div>
        <button 
          onClick={() => router.push('/categories')}
          className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
        >
          View All Categories <span className="text-xl">→</span>
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-8"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            onClick={() => router.push(`/categories?id=${cat.id}`)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div 
              className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-subtle group-hover:shadow-premium flex items-center justify-center transition-all duration-500 overflow-hidden relative"
            >
              {/* Subtle gradient bg overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ backgroundColor: cat.color || 'var(--primary)' }}
              />
              <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10 flex items-center justify-center">
                {renderDynamicIcon(cat.icon, 34, cat.color || 'var(--primary)')}
              </div>
            </div>
            <span className="mt-5 text-sm font-black text-slate-500 group-hover:text-primary transition-colors text-center px-1 tracking-tight leading-tight">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
