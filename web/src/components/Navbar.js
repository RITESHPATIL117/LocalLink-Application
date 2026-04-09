'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiUser, FiMapPin, FiSearch, FiHeart, FiHexagon } from 'react-icons/fi';
import { logoutUser } from '../store/authSlice';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: 'Requests', path: '/requests' },
  { name: 'Favorites', path: '/favorites' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 backdrop-blur-xl bg-white/85 shadow-premium border-b border-slate-200/50'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between min-h-[64px]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-300">
            <FiHexagon className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Local<span className="text-primary italic">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.path} href={link.path} className="relative group p-2">
                <span size="sm" className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-slate-600 group-hover:text-primary'
                }`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                  />
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications / Search (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button title="Search" className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary hover:shadow-subtle transition-all">
              <FiSearch size={20} />
            </button>
            <button title="Notifications" className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary hover:shadow-subtle relative transition-all">
              <FiBell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50" />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-[20px] border border-slate-100 hover:bg-white hover:shadow-subtle transition-all group">
                <div className="w-9 h-9 rounded-[14px] overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <FiUser className="text-primary" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-black text-slate-900 leading-tight truncate max-w-[100px]">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                    {user?.role || 'Member'}
                  </p>
                </div>
              </Link>
              
              {/* Desktop Logout Button */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex text-sm font-bold text-red-500 hover:text-red-600 px-3 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-black text-slate-600 hover:text-primary px-4 transition-colors">
                Login
              </Link>
              <Link href="/register" className="btn-premium px-6 py-2.5 !rounded-2xl text-xs uppercase tracking-widest">
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-[100%] left-0 right-0 bg-white border-b border-slate-100 shadow-premium py-6 overflow-hidden"
          >
            <div className="section-container flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl ${
                    pathname === link.path ? 'bg-primary/5 text-primary border border-primary/10' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="font-black text-base">{link.name}</span>
                  <FiHexagon size={16} />
                </Link>
              ))}
              
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-red-50 text-red-500 border border-red-100 mt-4"
                >
                  <span className="font-black text-base">Sign Out</span>
                  <FiUser size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
