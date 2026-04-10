'use client';
import Link from 'next/link';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <section className="section-container mt-4 md:mt-6 mb-10 md:mb-14">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10 p-6 md:p-10 lg:p-12">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary mb-4">
              Trusted Local Marketplace
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.08]">
              What service can we help you find today?
            </h1>
            <p className="text-slate-500 text-sm md:text-base mt-4 md:mt-5 max-w-xl">
              Reliable, certified local professionals for home services, repairs, beauty, and more.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-8">
              <Link href="/categories" className="btn-premium !rounded-full px-6 py-3 text-sm md:text-base">
                Get Help <FiArrowRight />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-slate-200 text-slate-700 font-semibold text-sm md:text-base hover:bg-slate-50 transition-colors"
              >
                <FiPlay size={16} /> Watch Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-cyan-200/20 rounded-3xl" />
            <img
              src="https://images.unsplash.com/photo-1621905252472-e8f1a7d8a581?q=80&w=1200"
              alt="Local service professionals"
              className="relative w-full h-[240px] md:h-[300px] lg:h-[360px] object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
