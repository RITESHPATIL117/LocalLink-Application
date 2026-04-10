'use client';
import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiHexagon, FiExternalLink, FiCheckCircle } from 'react-icons/fi';

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Requests', path: '/requests' },
  { name: 'Favorites', path: '/favorites' },
];

const TOP_SERVICES = [
  { name: 'Home Cleaning', path: '/categories' },
  { name: 'AC Repair', path: '/categories' },
  { name: 'Plumbing', path: '/categories' },
  { name: 'Electrician', path: '/categories' },
  { name: 'Salon for Women', path: '/categories' },
];

const SUPPORT_LINKS = [
  { name: 'Help Center', path: '/support' },
  { name: 'FAQs', path: '/support#faq' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 md:pt-16 pb-8 md:pb-10 border-t border-slate-900 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 pb-10 md:pb-14 border-b border-slate-900">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
                <FiHexagon className="text-white text-xl" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                Local<span className="text-primary italic">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting users with verified local professionals. Reliable service at your doorstep.
            </p>
            <div className="flex items-center gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-slate-400 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group">
                    <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Services */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Top Services</h4>
            <ul className="flex flex-col gap-4">
              {TOP_SERVICES.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.path} className="text-slate-400 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group">
                    <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">Support</h4>
            <ul className="flex flex-col gap-4">
              {SUPPORT_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.path} className="text-slate-400 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group">
                    <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Call to Action */}
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-white font-black text-sm mb-3">Want to partner?</h4>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">Join 5000+ professionals growing with us.</p>
              <Link href="/register?role=provider" className="w-full bg-primary text-white py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/10">
                Register as Provider <FiExternalLink size={14} />
              </Link>
            </div>
            
            <div className="mt-5 flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
              <FiCheckCircle className="text-emerald-500" />
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Verified Marketplace</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
          <div className="text-slate-500 text-xs font-medium leading-relaxed">
            &copy; {currentYear} <span className="text-slate-300 font-black">LocalHub Elite Pro</span>. All rights reserved. 
            <span className="mx-2">|</span> 
            Powered by <span className="text-primary font-bold">Purple Labs</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
