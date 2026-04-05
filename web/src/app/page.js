'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  FiSearch, FiMapPin, FiChevronRight, FiCheckCircle, FiStar, FiCalendar, FiBriefcase, FiFileText, FiHeadphones, FiZap, FiPhoneCall, FiMessageSquare, FiExternalLink, FiClock, FiPlus, FiBox, FiBell, FiLogOut, FiSettings, FiArrowRight, FiGift
} from 'react-icons/fi';
import { renderDynamicIcon } from '../utils/iconHelper';
import api from '../services/api';
import categoryService from '../services/categoryService';
import businessService from '../services/businessService';
import leadService from '../services/leadService';

// --- Static Data (Matching Mobile App) ---
const BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200',
    tag: '🏠 Elite Cleaning',
    title: 'Professional Home\nDeep Cleaning',
    subtitle: 'Safe, secure, and sparkling clean',
    cta: 'Book Now',
    query: 'Cleaning',
  },
  {
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200',
    tag: '⚡ Certified Electrical',
    title: 'Emergency Electrical\nSupport 24/7',
    subtitle: 'Verified local technicians',
    cta: 'Find Specialist',
    query: 'Electrical',
  },
  {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200',
    tag: '💅 Premium Salon',
    title: 'Luxury Grooming\nin Your Living Room',
    subtitle: 'Top-rated stylists at your service',
    cta: 'Explore Services',
    query: 'Beauty',
  },
];

const TRENDING = [
  { label: '❄️ AC Repair', q: 'AC Repair' },
  { label: '🪠 Pipe Repair', q: 'Plumbing' },
  { label: '✨ Deep Cleaning', q: 'Deep Cleaning' },
  { label: '🐛 Pest Control', q: 'Pest Control' },
  { label: '💇 Hair Styling', q: 'Beauty' },
  { label: '🔌 Wiring Check', q: 'Electrical' },
];

const HOW_IT_WORKS = [
  { step: '1', icon: <FiSearch />, color: '#3B82F6', title: 'Search', desc: 'Find verified local service providers near you' },
  { step: '2', icon: <FiCalendar />, color: '#10B981', title: 'Book', desc: 'Choose a time slot and confirm your booking instantly' },
  { step: '3', icon: <FiZap />, color: '#F59E0B', title: 'Get Served', desc: 'Sit back while our professionals handle everything' },
  { step: '4', icon: <FiStar />, color: '#EC4899', title: 'Rate & Review', desc: 'Share your experience to help the community' },
];

const TESTIMONIALS = [
  { id: 't1', name: 'Anjali Patil', role: 'Homeowner, Sangli', text: '"Booked a plumber in under 2 minutes. Super fast, professional service!"', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { id: 't2', name: 'Rohit Desai', role: 'Shop Owner, Pune', text: '"Their electricians fixed our wiring same day. Highly recommend!"', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 't3', name: 'Priya Kumar', role: 'Working Mom, Nashik', text: '"Deep cleaning service was outstanding. The team was courteous and thorough."', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
];

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Cleaning', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800' },
  { id: '2', name: 'Plumbing', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800' },
  { id: '3', name: 'Electrical', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=800' },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [categories, setCategories] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // --- Hydration guard for router ---
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // --- Auto-scroll effect for banner ---
  useEffect(() => {
    if (!hasMounted) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, bizRes, leadRes] = await Promise.all([
        categoryService.getCategories().catch(() => ({ data: FALLBACK_CATEGORIES })),
        businessService.getAllBusinesses({ featured: true }).catch(() => ({ data: [] })),
        isAuthenticated ? leadService.getUserLeads().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      setCategories(catRes.data || FALLBACK_CATEGORIES);
      setFeaturedBusinesses(bizRes.data || []);
      
      if (isAuthenticated) {
        const active = (leadRes.data || []).filter(l => l.status === 'pending' || l.status === 'contacted').length;
        setActiveBookingsCount(active);
      }
    } catch (e) {
      console.error('Data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="home-container" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Elite Header */}
      <header style={{ 
        backgroundColor: '#FFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '8px', borderRadius: '12px' }}>
            <FiMapPin color="#FFF" size={20} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px' }}>
            Local<span style={{ color: 'var(--color-primary)' }}>Hub</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9',
            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', position: 'relative'
          }}>
            <FiBell size={20} color="#64748B" />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#EF4444', border: '2px solid #FFF' }} />
          </button>
          
          {isAuthenticated ? (
            <Link href="/profile">
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              </div>
            </Link>
          ) : (
            <Link href="/login" style={{ 
              backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '10px 20px', borderRadius: '14px', fontWeight: '800', fontSize: '14px' 
            }}>Login</Link>
          )}
        </div>
      </header>


      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px' }}>
        
        {/* 2. Elite Greeting Banner */}
        <section style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', margin: 0 }}>
                {greetingText()}{isAuthenticated && user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <FiMapPin size={14} color="var(--color-primary)" />
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '800' }}>Sangli, Maharashtra</span>
                <span style={{ fontSize: '10px', color: '#CBD5E1' }}>▼</span>
              </div>
            </div>
            {activeBookingsCount > 0 && (
              <Link href="/requests" style={{ 
                backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', padding: '8px 16px', borderRadius: '24px',
                display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#22C55E' }} />
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#166534' }}>{activeBookingsCount} Active Bookings</span>
              </Link>
            )}
          </div>
        </section>

        {/* 3. Search Section (Justdial-Inspired) */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ 
            backgroundColor: '#FFF', borderRadius: '32px', padding: '16px', border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            {/* Location Selector */}
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', 
              borderRight: '1px solid #E2E8F0', flex: '0.4', cursor: 'pointer'
            }}>
              <FiMapPin color="var(--color-primary)" size={20} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Your Location</span>
                <span style={{ fontSize: '15px', fontWeight: '900', color: '#1E293B' }}>Sangli, MH ▼</span>
              </div>
            </div>

            {/* Service Input */}
            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FiSearch color="#94A3B8" size={24} />
              <div 
                onClick={() => hasMounted && router.push('/search')}
                style={{ flex: 1, cursor: 'pointer' }}
              >
                <input 
                  type="text" 
                  placeholder="Search for Services (e.g. 'AC Repair', 'Wedding Decor')" 
                  readOnly
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: '18px', fontWeight: '600', color: '#1E293B', width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>

            <button 
              onClick={() => hasMounted && router.push('/search')}
              style={{ 
                backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '18px 40px', borderRadius: '24px', border: 'none',
                fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(30,64,175,0.25)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >Search Now</button>
          </div>
        </section>
        {/* 3.1 Quick Links Bar (Justdial Special) */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
            {[
              { label: 'B2B', icon: '🏢', route: '/categories?id=b2b' },
              { label: 'Cleaning', icon: '🧹', route: '/categories?id=cleaning' },
              { label: 'Repairs', icon: '🛠️', route: '/categories?id=repairs' },
              { label: 'Daily Needs', icon: '🛒', route: '/categories?id=daily' },
              { label: 'Wedding', icon: '💍', route: '/categories?id=wedding' },
              { label: 'Real Estate', icon: '🏠', route: '/categories?id=realestate' },
              { label: 'Jobs', icon: '💼', route: '/categories?id=jobs' },
              { label: 'Education', icon: '🎓', route: '/categories?id=education' },
            ].map((link, idx) => (
              <div 
                key={idx} 
                onClick={() => hasMounted && router.push(link.route)}
                style={{ 
                  backgroundColor: '#FFF', padding: '10px 20px', borderRadius: '12px', border: '1px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: '14px', fontWeight: '800', color: '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            ))}
          </div>
        </section>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '32px' }}>
          
          <div>
            {/* 4. Hero Banner Carousel */}
            <section style={{ marginBottom: '24px', position: 'relative', height: '360px', borderRadius: '32px', overflow: 'hidden' }}>
              {BANNERS.map((banner, index) => (
                <div 
                  key={index}
                  style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: activeBannerIndex === index ? 1 : 0, transition: 'opacity 1s ease-in-out',
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), transparent), url(${banner.image})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', padding: '60px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center'
                  }}
                >
                  <div style={{ maxWidth: '500px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '1000', color: '#FFF', margin: '0 0 16px 0', lineHeight: 1.1 }}>{banner.title}</h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '32px' }}>{banner.subtitle}</p>
                    <button 
                      onClick={() => hasMounted && router.push(`/search?q=${banner.query}`)}
                      style={{ 
                        backgroundColor: '#FFF', color: 'var(--color-primary)', padding: '16px 32px', borderRadius: '18px',
                        border: 'none', fontWeight: '900', fontSize: '15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      Book Now <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
              {/* Pagination Dots */}
              <div style={{ position: 'absolute', bottom: '30px', left: '60px', display: 'flex', gap: '10px' }}>
                {BANNERS.map((_, i) => (
                  <div 
                    key={i}
                    onClick={() => setActiveBannerIndex(i)}
                    style={{ 
                      width: activeBannerIndex === i ? '40px' : '10px', height: '10px', borderRadius: '5px', 
                      backgroundColor: '#FFF', opacity: activeBannerIndex === i ? 1 : 0.4, transition: 'all 0.3s', cursor: 'pointer' 
                    }}
                  />
                ))}
              </div>
            </section>

            {/* 5. Improved Category Grid (Justdial-Inspired) */}
            <section style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '1000', color: '#1E293B', letterSpacing: '-1px' }}>What are you looking for today?</h3>
                <Link href="/categories" style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '14px', textDecoration: 'none' }}>All Categories →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '20px' }}>
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => hasMounted && router.push(`/categories?id=${cat.id}`)}
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    className="cat-hover-card"
                  >
                    <div style={{ 
                      width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#FFF',
                      margin: '0 auto 8px auto', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      {renderDynamicIcon(cat.icon, 32, cat.color || 'var(--color-primary)')}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#475569' }}>{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5.1 "Ad/CTA" Banner for Pros (New Section) */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)', 
                borderRadius: '32px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: '1px solid #DBEAFE', boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.05)'
              }}>
                <div style={{ maxWidth: '60%' }}>
                  <div style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '6px 12px', borderRadius: '10px', display: 'inline-block', fontSize: '11px', fontWeight: '900', marginBottom: '16px' }}>GROW YOUR BUSINESS</div>
                  <h3 style={{ fontSize: '30px', fontWeight: '1000', color: '#1E293B', marginBottom: '12px', letterSpacing: '-1px' }}>List your business & get more customers</h3>
                  <p style={{ fontSize: '16px', color: '#64748B', fontWeight: '500', lineHeight: '1.6' }}>Join 5000+ local professionals already using LocalHub to scale their services in Sangli.</p>
                </div>
                <button 
                  onClick={() => hasMounted && router.push('/register?role=provider')}
                  style={{ 
                    backgroundColor: '#1E40AF', color: '#FFF', padding: '18px 36px', borderRadius: '20px', 
                    fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(30,64,175,0.3)' 
                  }}
                >
                  Get Started for Free
                </button>
              </div>
            </section>

             {/* 6. Featured Providers (Justdial-inspired Cards) */}
            <section style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '1000', color: '#1E293B', letterSpacing: '-1px' }}>Top Rated Professionals in Sangli</h3>
                <Link href="/search" style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '14px', textDecoration: 'none' }}>View All →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {featuredBusinesses.length > 0 ? featuredBusinesses.map((biz) => (
                  <div 
                    key={biz.id} 
                    onClick={() => hasMounted && router.push(`/business/${biz.id}`)}
                    style={{ backgroundColor: '#FFF', borderRadius: '32px', overflow: 'hidden', border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'all 0.3s' }}
                    className="provider-card"
                  >
                    <div style={{ height: '160px', position: 'relative' }}>
                      <img src={biz.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#FFF', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                         <FiStar color="#F59E0B" fill="#F59E0B" size={14} />
                         <span style={{ fontSize: '13px', fontWeight: '900' }}>{biz.rating || '4.9'}</span>
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                         <div style={{ backgroundColor: '#F0FDF4', color: '#166534', fontSize: '10px', padding: '4px 8px', borderRadius: '6px', fontWeight: '900' }}>VERIFIED</div>
                         <div style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '10px', padding: '4px 8px', borderRadius: '6px', fontWeight: '900' }}>ELITE</div>
                      </div>
                      <h4 style={{ fontSize: '19px', fontWeight: '900', color: '#1E293B', marginBottom: '6px' }}>{biz.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', marginBottom: '20px' }}>
                         <FiMapPin size={12} />
                         <span style={{ fontSize: '13px', fontWeight: '600' }}>{biz.location || 'Local Professional'}</span>
                      </div>
                      <button style={{ 
                        width: '100%', backgroundColor: '#0F172A', color: '#FFF', border: 'none',
                        padding: '14px', borderRadius: '18px', fontWeight: '800', fontSize: '14px'
                      }}>Send Enquiry</button>
                    </div>
                  </div>
                )) : [1,2,3,4].map(i => (
                  <div key={i} style={{ height: '320px', backgroundColor: '#F1F5F9', borderRadius: '32px', animation: 'pulse 2s infinite' }} />
                ))}
              </div>
            </section>
          </div>

          <aside>
            {/* 7. Quick Actions Grid */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Book Service', icon: <FiCalendar />, color: '#3B82F6', route: '/search' },
                  { label: 'List Business', icon: <FiBriefcase />, color: '#10B981', route: '/login' },
                  { label: 'My Bookings', icon: <FiFileText />, color: '#F59E0B', route: '/requests' },
                  { label: 'Support', icon: <FiHeadphones />, color: '#8B5CF6', route: '/support' },
                ].map(a => (
                  <div 
                    key={a.label}
                    onClick={() => hasMounted && router.push(a.route)}
                    style={{ 
                      backgroundColor: '#FFF', padding: '24px', borderRadius: '28px', border: '1px solid #F1F5F9',
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '18px', backgroundColor: `${a.color}15`, 
                      color: a.color, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto', fontSize: '24px'
                    }}>
                      {a.icon}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Emergency QuickFix Hub */}
            <section style={{ marginBottom: '32px', backgroundColor: '#FFF', borderRadius: '28px', padding: '24px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: '900', color: '#1E293B', margin: 0 }}>QuickFix Hub</h4>
                <div style={{ backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '6px' }}>
                  <span style={{ color: '#EF4444', fontSize: '10px', fontWeight: '900', letterSpacing: '0.5px' }}>LIVE HELP</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { name: 'Plumber', icon: '🪠', color: '#EF4444', q: 'Plumber' },
                  { name: 'Electrician', icon: '🔌', color: '#F59E0B', q: 'Electrician' },
                  { name: 'AC Repair', icon: '❄️', color: '#3B82F6', q: 'AC' },
                  { name: 'Car Help', icon: '🚗', color: '#111827', q: 'Car' },
                ].map(item => (
                  <div 
                    key={item.name}
                    onClick={() => hasMounted && router.push(`/search?q=${item.q}`)}
                    style={{ 
                      padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9',
                      display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' 
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Summer Promo Banner */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--color-primary), #E65C00)', 
                borderRadius: '28px', padding: '30px', color: '#FFF', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '1px' }}>LIMITED OFFER</span>
                  </div>
                  <h4 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0' }}>Summer Special 🔥</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '20px' }}>20% off on all AC Repairs & Deep Cleaning services.</p>
                  <button style={{ 
                    backgroundColor: '#FFF', color: 'var(--color-primary)', padding: '12px 24px', borderRadius: '14px',
                    border: 'none', fontWeight: '900', fontSize: '14px', cursor: 'pointer'
                  }}>Claim Discount</button>
                </div>
                <FiZap size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', color: 'rgba(255,255,255,0.1)' }} />
              </div>
            </section>

            {/* 10. Trending Labels */}
            <section style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '17px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>🔥 Trending Searches</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {TRENDING.map(t => (
                  <div 
                    key={t.label} 
                    onClick={() => hasMounted && router.push(`/search?q=${t.q}`)}
                    style={{ 
                      padding: '10px 18px', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #F1F5F9',
                      fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                  >
                    {t.label}
                  </div>
                ))}
              </div>
            </section>
          </aside>

        </div>

        {/* 11. How It Works Section */}
        <section style={{ margin: '12px 0', padding: '16px 0', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '1000', color: '#1E293B', letterSpacing: '-1px' }}>How It Works</h2>
            <p style={{ color: '#64748B', fontWeight: '500', fontSize: '16px', marginTop: '4px' }}>Experience seamless local service booking in 4 easy steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {HOW_IT_WORKS.map((item, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '30px', backgroundColor: `${item.color}15`,
                  color: item.color, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto', fontSize: '32px'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>{item.title}</h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '22px', fontWeight: '500' }}>{item.desc}</p>
                {index < 3 && <div style={{ position: 'absolute', top: '40px', right: '-40px', width: '40px', height: '2px', backgroundColor: '#F1F5F9' }} className="step-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* 12. Testimonials Area */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: '1000', color: '#1E293B', letterSpacing: '-1px' }}>What Customers Say ⭐</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>←</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>→</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px' }} className="no-scrollbar">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} style={{ 
                minWidth: '350px', backgroundColor: '#FFF', padding: '32px', borderRadius: '32px',
                border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[1,2,3,4,5].map(i => <FiStar key={i} color="#F59E0B" fill="#F59E0B" size={16} />)}
                </div>
                <p style={{ fontSize: '16px', color: '#334155', fontWeight: '500', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '24px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={t.avatar} style={{ width: '50px', height: '50px', borderRadius: '16px' }} />
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{t.name}</h5>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 768px) {
          main > div { grid-template-columns: 1fr !important; }
          .step-connector { display: none; }
        }
      `}</style>
    </div>
  );
}
