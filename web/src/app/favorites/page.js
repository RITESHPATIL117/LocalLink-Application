'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  FiHeart, FiSearch, FiStar, FiMapPin, FiChevronRight, FiGrid, FiList, FiSparkles, FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';

const CATEGORIES = ['All', 'Home Services', 'Personal Care', 'Cleaning', 'Repair'];

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [favorites, setFavorites] = useState([]); // This would normally come from a custom hook or Redux
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter Logic matching mobile app useMemo
  const filteredFavorites = favorites.filter(b => {
    const categoryMatch = activeTab === 'All' || b.category?.toLowerCase() === activeTab.toLowerCase();
    const searchMatch = !search.trim() || 
      b.name?.toLowerCase().includes(search.toLowerCase()) || 
      b.category?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (!isAuthenticated) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <FiHeart size={48} color="#D1D5DB" />
      <h2 style={{ marginTop: '20px' }}>Login to view your saved places</h2>
      <button onClick={() => router.push('/login')} className="btn-primary" style={{ marginTop: '24px', padding: '12px 32px' }}>Login</button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Header & Filters Parity */}
      <header style={{ 
        backgroundColor: '#FFF', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>←</button>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '1000', color: '#1E293B', margin: 0, letterSpacing: '-1px' }}>My Favorites</h1>
                <div style={{ backgroundColor: '#FEF2F2', padding: '4px 12px', borderRadius: '8px', width: 'fit-content', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: '#EF4444', textTransform: 'uppercase' }}>{favorites.length} SAVED PLACES</span>
                </div>
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #F1F5F9', padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: '12px', width: '400px'
            }}>
              <FiSearch color="#94A3B8" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your saved services..."
                style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }} className="no-scrollbar">
            {CATEGORIES.map(f => {
              const active = activeTab === f;
              return (
                <button 
                  key={f}
                  onClick={() => setActiveTab(f)}
                  style={{ 
                    whiteSpace: 'nowrap', padding: '10px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: '800',
                    cursor: 'pointer', border: '1.5px solid', 
                    backgroundColor: active ? '#1E293B' : '#FFF',
                    borderColor: active ? '#1E293B' : '#F1F5F9',
                    color: active ? '#FFF' : '#64748B',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        
        {favorites.length === 0 ? (
          
          /* 2. Stunning Empty State Parity */
          <div style={{ textAlign: 'center', padding: '120px 40px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 40px auto' }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '80px', backgroundColor: '#FEF2F2',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
              }}>
                <FiHeart size={80} color="#EF4444" fill="#EF4444" opacity={0.8} />
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '-10px', color: '#F59E0B', transform: 'rotate(15deg)' }}><FiStar size={32} fill="#F59E0B" /></div>
              <div style={{ position: 'absolute', bottom: '20px', left: '-10px', color: 'var(--color-primary)', transform: 'rotate(-15deg)' }}><FiSparkles size={28} /></div>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '1000', color: '#1E293B', letterSpacing: '-1px' }}>Nothing feels like home yet</h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '450px', margin: '16px auto 48px auto', lineHeight: '1.6', fontWeight: '500' }}>
              Found a local service you love? Tap the heart icon on their profile to save them for quick booking next time.
            </p>
            
            <button 
              onClick={() => router.push('/search')}
              style={{ 
                background: 'linear-gradient(135deg, var(--color-primary), #4338CA)', color: '#FFF', 
                padding: '20px 48px', borderRadius: '24px', fontWeight: '1000', fontSize: '16px', border: 'none',
                cursor: 'pointer', boxShadow: '0 12px 30px rgba(30,64,175,0.3)', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto'
              }}
            >
              <FiSearch /> Discover Services <FiArrowRight />
            </button>
          </div>

        ) : (
          
          /* 3. Favorites Grid Parity */
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1E293B' }}>Saved Professionals</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFF', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiGrid size={18} color="var(--color-primary)" /></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFF', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiList size={18} color="#94A3B8" /></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredFavorites.map(biz => (
                <Link key={biz.id} href={`/business/${biz.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: '#FFF', borderRadius: '28px', overflow: 'hidden', border: '1px solid #F1F5F9', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ height: '200px', position: 'relative' }}>
                      <img src={biz.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '16px', right: '16px', width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <FiHeart fill="#EF4444" color="#EF4444" size={20} />
                      </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', marginBottom: '8px' }}>{biz.name}</h4>
                      <p style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', marginBottom: '20px' }}>{biz.category}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <FiStar fill="#F59E0B" color="#F59E0B" size={14} />
                           <span style={{ fontSize: '14px', fontWeight: '900' }}>4.9</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-primary)' }}>Book Now →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
