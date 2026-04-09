'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function BusinessCard({ business, horizontal = false }) {
  const router = useRouter();
  
  const imageSrc = (business.image_url && business.image_url.length > 10) 
    ? business.image_url 
    : (business.image && business.image.length > 10) 
      ? business.image 
      : `https://images.unsplash.com/photo-1581093190018-7096d3964db3?q=80&w=600&sig=${business.name || 'service'}`;

  const isVerified = (business.is_verified == 1) || business.tier === 'Diamond';

  return (
    <motion.article
      whileHover={{ y: -10 }}
      className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-subtle hover:shadow-premium transition-all duration-500 cursor-pointer group h-full ${
        horizontal ? 'flex flex-col md:flex-row' : 'flex flex-col'
      }`}
      onClick={() => router.push(`/business/${business.id}`)}
    >
      {/* Media Content */}
      <div className={`relative overflow-hidden ${horizontal ? 'h-52 md:h-auto md:w-72 md:flex-shrink-0' : 'aspect-[4/3] min-h-[200px] max-h-[260px]'}`}>
        <img 
          src={imageSrc} 
          alt={business.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Top Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
           {isVerified && (
             <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-lg">
               <FiShield className="text-primary text-sm" fill="currentColor" />
               <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">Verified Pro</span>
             </div>
           )}
           {business.tier === 'Diamond' && (
             <div className="bg-amber-400 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
               <FiStar className="text-white text-sm" fill="currentColor" />
               <span className="text-[10px] font-black tracking-widest uppercase">Elite Tier</span>
             </div>
           )}
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
          <FiStar className="text-amber-400 fill-amber-400 text-sm" />
          <span className="text-sm font-black text-slate-900">{business.rating || '4.9'}</span>
        </div>
        
        {/* Availability Badge */}
        <div className="absolute bottom-4 left-4 bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
           <span className="text-[9px] font-black text-white tracking-widest uppercase">Available</span>
        </div>
      </div>

      {/* Text Content */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
            {business.category_name || 'Premium Service'}
          </span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {business.name}
        </h3>
        
        <div className="flex items-start gap-2 mb-8">
          <FiMapPin className="text-slate-400 mt-1 text-sm flex-none" />
          <p className="text-sm font-semibold text-slate-500 line-clamp-2 leading-relaxed">
            {business.address || 'Sangli, Maharashtra, India'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Starts at</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">₹499</p>
          </div>
          <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group/btn shadow-sm">
            <FiArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
