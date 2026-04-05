'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  FiClock, FiCheckCircle, FiXCircle, FiGrid, FiList, 
  FiCalendar, FiMapPin, FiPhone, FiDollarSign, FiInfo, FiChevronRight, FiBell
} from 'react-icons/fi';
import leadService from '../../services/leadService';

const STATUS_CONFIG = {
  All:       { color: '#6366F1', bg: '#EEF2FF', icon: <FiGrid /> },
  Pending:   { color: '#F59E0B', bg: '#FFFBEB', icon: <FiClock /> },
  Accepted:  { color: '#10B981', bg: '#ECFDF5', icon: <FiCheckCircle /> },
  Completed: { color: '#3B82F6', bg: '#EFF6FF', icon: <FiCheckCircle /> },
  Cancelled: { color: '#EF4444', bg: '#FEF2F2', icon: <FiXCircle /> },
};

const FILTERS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await leadService.getUserLeads();
      setRequests(res.data || []);
    } catch (e) {
      console.error('Fetch requests error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await leadService.updateLeadStatus(id, 'Cancelled');
      fetchRequests();
      alert('Request cancelled successfully.');
    } catch (e) {
      alert('Failed to cancel request');
    }
  };

  const filtered = activeFilter === 'All' 
    ? requests 
    : requests.filter(r => r.status?.toLowerCase() === activeFilter.toLowerCase());

  const counts = {
    Active: requests.filter(r => r.status === 'Accepted' || r.status === 'Pending').length,
    Completed: requests.filter(r => r.status === 'Completed').length,
    Cancelled: requests.filter(r => r.status === 'Cancelled').length
  };

  if (!isAuthenticated) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <FiInfo size={48} color="#D1D5DB" />
      <h2 style={{ marginTop: '20px' }}>Please login to view your requests</h2>
      <button onClick={() => router.push('/login')} className="btn-primary" style={{ marginTop: '24px', padding: '12px 32px' }}>Login</button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Header Parity */}
      <header style={{ 
        backgroundColor: '#FFF', padding: '24px 40px', borderBottom: '1px solid #F1F5F9',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>←</button>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', margin: 0, letterSpacing: '-1px' }}>My Requests</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '8px', width: 'fit-content' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '3px', backgroundColor: 'var(--color-primary)' }} />
                 <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', textTransform: 'uppercase' }}>{requests.length} TOTAL ENTRIES</span>
              </div>
            </div>
          </div>
          <button style={{ 
            width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F1F5F9', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer' 
          }}>
            <FiBell size={20} color="#64748B" />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        
        {/* 2. Stats Dashboard Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {[
            { label: 'Active', count: counts.Active, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Completed', count: counts.Completed, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Cancelled', count: counts.Cancelled, color: '#EF4444', bg: '#FEF2F2' },
          ].map(stat => (
            <div key={stat.label} style={{ 
              backgroundColor: '#FFF', padding: '32px', borderRadius: '32px', border: '1px solid #F1F5F9',
              textAlign: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '1000', color: stat.color }}>{stat.count}</div>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '1px' }}>{stat.label} Bookings</div>
            </div>
          ))}
        </section>

        {/* 3. Filter Tabs Panel */}
        <section style={{ 
          backgroundColor: '#FFF', borderRadius: '24px', padding: '12px', marginBottom: '40px',
          border: '1px solid #F1F5F9', display: 'flex', gap: '8px', overflowX: 'auto'
        }}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{ 
                  padding: '12px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: '800',
                  cursor: 'pointer', border: 'none', 
                  backgroundColor: active ? 'rgba(30,64,175,0.08)' : 'transparent',
                  color: active ? 'var(--color-primary)' : '#64748B',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{STATUS_CONFIG[f].icon}</span>
                {f}
              </button>
            )
          })}
        </section>

        {/* 4. Requests List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>⏳ Refreshing booking ledger...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', backgroundColor: '#FFF', borderRadius: '40px', border: '1px solid #F1F5F9' }}>
            <FiList size={80} color="#E2E8F0" />
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginTop: '24px' }}>No bookings found</h3>
            <p style={{ color: '#94A3B8', marginTop: '12px', fontSize: '16px' }}>{activeFilter === 'All' ? "You haven't booked any services yet." : `No ${activeFilter} requests found.`}</p>
            <button onClick={() => router.push('/search')} style={{ marginTop: '32px', backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '16px 32px', borderRadius: '18px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>Discover Services</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {filtered.map((item) => {
              const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
              return (
                <div key={item.id} style={{ 
                  backgroundColor: '#FFF', borderRadius: '32px', overflow: 'hidden', border: '1px solid #F1F5F9',
                  boxShadow: '0 12px 30px rgba(15,23,42,0.04)', display: 'grid', gridTemplateColumns: '140px 1fr 280px'
                }}>
                  <div style={{ height: '100%', position: 'relative' }}>
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '20px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{item.businessName || 'Local Service'}</h4>
                      <div style={{ 
                        backgroundColor: cfg.bg, color: cfg.color, padding: '4px 12px', borderRadius: '8px', 
                        fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px' 
                      }}>
                        {item.status.toUpperCase()}
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#64748B', fontWeight: '600', marginBottom: '24px' }}>{item.service || 'General Service Support'}</p>
                    
                    <div style={{ display: 'flex', gap: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                        <FiCalendar size={14} />
                        <span style={{ fontSize: '13px', fontWeight: '800' }}>{item.date || 'To be scheduled'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                        <FiClock size={14} />
                        <span style={{ fontSize: '13px', fontWeight: '800' }}>{item.time || 'Awaiting slot'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '32px', borderLeft: '1.5px dashed #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '24px' }}>
                       <div style={{ fontSize: '11px', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', marginBottom: '4px' }}>ESTIMATED PRICE</div>
                       <div style={{ fontSize: '26px', fontWeight: '1000', color: '#1E293B' }}>{item.price || (item.amount ? `₹${item.amount}` : '₹499')}</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {item.status === 'Accepted' && (
                        <button style={{ 
                          width: '100%', backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none',
                          padding: '14px', borderRadius: '16px', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                          Confirm Slot <FiChevronRight />
                        </button>
                      )}
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ 
                          flex: 1, backgroundColor: '#1E293B', color: '#FFF', border: 'none',
                          padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                          <FiPhone size={14} /> Call
                        </button>
                        {item.status === 'Pending' && (
                          <button 
                            onClick={() => handleCancelBooking(item.id)}
                            style={{ 
                              flex: 1, backgroundColor: '#FFF', color: '#EF4444', border: '1.5px solid #FCA5A5',
                              padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '12px'
                            }}
                          >Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
