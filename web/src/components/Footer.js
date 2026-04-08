'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, 
  FiHexagon, FiExternalLink, FiShield, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';

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
    <footer className="bg-slate-950 text-slate-300 pt-24 pb-12 border-t border-slate-900 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-20 border-b border-slate-900">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
                <FiHexagon className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                Local<span className="text-primary italic">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Connecting millions of users with top-rated local professionals since 2024. Reliable, verified, and always at your doorstep.
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
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8">Navigation</h4>
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
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8">Top Services</h4>
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
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8">Support</h4>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-white font-black text-sm mb-4">Want to partner?</h4>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">Join 5000+ professionals growing their revenue with us.</p>
              <Link href="/register?role=provider" className="w-full bg-primary text-white py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/10">
                Register as Provider <FiExternalLink size={14} />
              </Link>
            </div>
            
            <div className="mt-8 flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              <FiCheckCircle className="text-emerald-500" />
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Verified Marketplace</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-xs font-medium">
            &copy; {currentYear} <span className="text-slate-300 font-black">LocalHub Elite Pro</span>. All rights reserved. 
            <span className="mx-2">|</span> 
            Powered by <span className="text-primary font-bold">Purple Labs</span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors">Privacy Policy</Link>
            <div className="flex gap-4">
               {/* Mobile App Badges Simplified */}
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                 <div className="w-3 h-3 bg-white rounded-full" />
                 <span className="text-[10px] font-bold text-white uppercase">App Store</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
