'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FiSearch, FiFilter, FiMap, FiList, FiStar, FiMapPin, FiArrowRight, FiZap, FiChevronRight, FiChevronLeft
} from 'react-icons/fi';
import businessService from '../../services/businessService';
import Link from 'next/link';

const FILTERS = ['Top Rated', 'Near Me', 'Open Now', 'Price', 'Newest'];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';

  const [search, setSearch] = useState(query);
  const [activeFilter, setActiveFilter] = useState('Top Rated');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchResults();
  }, [query, categoryId, activeFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = {
        q: query,
        category_id: categoryId,
        filter: activeFilter.toLowerCase().replace(' ', '_'),
      };
      const res = await businessService.getAllBusinesses(params).catch(() => ({ data: [] }));
      setResults(res.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. High-Fidelity Header */}
      <header style={{ 
        backgroundColor: '#FFF', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>←</button>
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <div style={{ 
                backgroundColor: '#F1F5F9', borderRadius: '14px', padding: '0 16px', height: '52px',
                display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E2E8F0'
              }}>
                <FiSearch color="#94A3B8" size={18} />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search local experts..."
                  style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', color: '#1E293B' }}
                />
              </div>
            </form>
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '12px', padding: '4px' }}>
              <button 
                onClick={() => setViewMode('grid')}
                style={{ 
                  padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'grid' ? '#FFF' : 'transparent', boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <FiList size={18} color={viewMode === 'grid' ? 'var(--color-primary)' : '#64748B'} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                style={{ 
                  padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: viewMode === 'list' ? '#FFF' : 'transparent', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <FiMap size={18} color={viewMode === 'list' ? 'var(--color-primary)' : '#64748B'} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <div style={{ 
          maxWidth: '1200px', margin: '0 auto', padding: '0 24px 12px 24px', 
          display: 'flex', gap: '10px', overflowX: 'auto'
        }} className="no-scrollbar">
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{ 
                  whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800',
                  cursor: 'pointer', border: '1.5px solid', 
                  backgroundColor: active ? 'var(--color-primary)' : '#FFF',
                  borderColor: active ? 'var(--color-primary)' : '#E2E8F0',
                  color: active ? '#FFF' : '#64748B',
                  boxShadow: active ? '0 4px 8px rgba(30,64,175,0.2)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1E293B', margin: 0 }}>
            {query ? `Results for "${query}"` : (categoryId ? 'Category Specialists' : 'All Professionals')}
            <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '600', marginLeft: '12px' }}>(${results.length} found)</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>⏳ Synchronizing lead data...</div>
        ) : results.length === 0 ? (
          <div style={{ 
            backgroundColor: '#FFF', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', 
            border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '40px', backgroundColor: '#F8FAFC', 
              fontSize: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto',
              color: '#CBD5E1'
            }}>🔍</div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>No exact matches found</h3>
            <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
              We couldn't find any professionals matching that search. Expand your filters or try another neighborhood.
            </p>
            <button 
              onClick={() => { setSearch(''); router.push('/search'); }}
              style={{ padding: '16px 32px', borderRadius: '18px', backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none', fontWeight: '900', cursor: 'pointer' }}
            >Clear all filters</button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
            gap: '24px'
          }}>
            {results.map((biz) => (
              <Link href={`/business/${biz.id}`} key={biz.id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: '#FFF', borderRadius: '28px', overflow: 'hidden', border: '1px solid #F1F5F9',
                  boxShadow: '0 10px 30px rgba(30,41,59,0.04)', transition: 'transform 0.2s', display: viewMode === 'list' ? 'flex' : 'block'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ 
                    position: 'relative', 
                    height: viewMode === 'list' ? '240px' : '200px',
                    width: viewMode === 'list' ? '300px' : '100%',
                    flexShrink: 0
                  }}>
                    <img src={biz.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ 
                      position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.92)', 
                      padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}>
                      <FiStar color="#F59E0B" fill="#F59E0B" size={14} />
                      <span style={{ fontSize: '13px', fontWeight: '900', color: '#1E293B' }}>{biz.rating || '4.9'}</span>
                    </div>
                  </div>
                  
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{biz.name}</h4>
                      {biz.tier === 'Diamond' && <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '10px', fontWeight: '900', padding: '4px 8px', borderRadius: '6px' }}>DIAMOND</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                      <FiMapPin size={14} /> {biz.address || 'Sangli, India'} — {biz.category || 'Expert'}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {['Fast Support', 'Verified', 'Certified'].map(tag => (
                        <span key={tag} style={{ backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#94A3B8', border: '1px solid #F1F5F9' }}>
                          ✓ {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                      <button style={{ 
                        flex: 1, backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none',
                        padding: '12px', borderRadius: '14px', fontWeight: '900', fontSize: '14px'
                      }}>Book Now</button>
                      <button style={{ 
                        width: '48px', height: '48px', backgroundColor: '#F1F5F9', border: 'none',
                        borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>📞</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* 2. Floating Action Button Parity */}
      {results.length > 0 && (
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <button style={{ 
            background: 'linear-gradient(135deg, var(--color-primary), #6366F1)', color: '#FFF', 
            padding: '16px 32px', borderRadius: '35px', fontWeight: '900', fontSize: '14px', 
            letterSpacing: '1px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 12px 24px rgba(30,64,175,0.4)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <FiZap size={18} /> GET BEST PRICE
          </button>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search System...</div>}>
      <SearchContent />
    </Suspense>
  );
}
