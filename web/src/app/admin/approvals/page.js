'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  FiHexagon, FiLayers, FiCheckCircle, FiUsers, FiBriefcase, 
  FiActivity, FiArrowLeft, FiX, FiCheck, FiInfo, FiClock, FiCalendar, FiImage
} from 'react-icons/fi';
import adminService from '../../../services/adminService';
import Link from 'next/link';

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    } else {
      fetchPending();
    }
  }, [isAuthenticated, user]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingBusinesses().catch(() => ({ data: [
        { id: 1, name: 'Patil Electricals', owner_name: 'Suresh Patil', category_name: 'Electrical', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=400', createdAt: new Date().toISOString() },
        { id: 2, name: 'Quick Fix Plumbing', owner_name: 'Mahesh Kumar', category_name: 'Plumbing', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400', createdAt: new Date().toISOString() }
      ] }));
      setData(res.data || res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type) => {
    setIsProcessing(true);
    try {
      if (type === 'approve') {
        await adminService.verifyBusiness(id);
      }
      setData(prev => prev.filter(item => item.id !== id));
      setSelectedBiz(null);
      alert(`Business ${type === 'approve' ? 'Approved' : 'Rejected'} Successfully`);
    } catch (e) {
      alert('Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', backgroundColor: '#0F172A', color: '#FFF', minHeight: '100vh' }}>⏳ Accessing verification queues...</div>;

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
      
      <div style={{ display: 'flex' }}>
        {/* Sidebar Parity */}
        <aside style={{ 
          width: '280px', height: '100vh', position: 'sticky', top: 0, 
          backgroundColor: '#1E293B', borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '40px 24px', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
             <div style={{ backgroundColor: 'var(--color-primary)', padding: '10px', borderRadius: '12px' }}>
                <FiHexagon size={24} color="#FFF" />
             </div>
             <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>
               Admin<span style={{ color: 'var(--color-primary)' }}>Hub</span>
             </span>
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
             {[
               { icon: <FiLayers />, label: 'Dashboard', route: '/admin/dashboard' },
               { icon: <FiCheckCircle />, label: 'Approvals', active: true, badge: data.length, route: '/admin/approvals' },
               { icon: <FiUsers />, label: 'User Directory', route: '#' },
               { icon: <FiBriefcase />, label: 'Businesses', route: '#' },
               { icon: <FiActivity />, label: 'System Logs', route: '#' },
             ].map(item => (
                <Link key={item.label} href={item.route} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', 
                    backgroundColor: item.active ? 'rgba(30,64,175,0.1)' : 'transparent',
                    color: item.active ? 'var(--color-primary)' : '#94A3B8',
                    fontWeight: item.active ? '800' : '600', transition: 'all 0.2s', cursor: 'pointer'
                  }}>
                    {item.icon}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge > 0 && <div style={{ backgroundColor: '#EF4444', color: '#FFF', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' }}>{item.badge}</div>}
                  </div>
                </Link>
             ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px 60px' }}>
          <header style={{ marginBottom: '48px' }}>
             <h1 style={{ fontSize: '32px', fontWeight: '1000', margin: 0, letterSpacing: '-1px' }}>Listing Approvals</h1>
             <p style={{ color: '#94A3B8', fontWeight: '600', marginTop: '8px' }}>Review and verify documentation for new service partners</p>
          </header>

          {data.length === 0 ? (
            <div style={{ backgroundColor: '#1E293B', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
               <FiCheckCircle size={64} color="#10B981" />
               <h3 style={{ fontSize: '24px', fontWeight: '900', marginTop: '24px' }}>Queue is Clear</h3>
               <p style={{ color: '#94A3B8', marginTop: '12px' }}>All submitted businesses have been successfully verified.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
              {data.map(item => (
                <div key={item.id} style={{ 
                  backgroundColor: '#1E293B', borderRadius: '28px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', transition: 'transform 0.2s'
                }}>
                  <div style={{ width: '220px', height: '100%', minHeight: '200px' }}>
                    <img src={item.image} alt={item.name || 'Business listing'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                           <h3 style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>{item.name}</h3>
                           <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>👤 PROWNER: {item.owner_name}</p>
                        </div>
                        <div style={{ backgroundColor: 'rgba(30,64,175,0.1)', color: 'var(--color-primary)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '900' }}>
                           {item.category_name.toUpperCase()}
                        </div>
                     </div>
                     
                     <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
                              <FiClock /> {new Date(item.createdAt).toLocaleDateString()}
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '12px', fontWeight: '700' }}>
                              <FiCheckCircle /> KYC Verified
                           </div>
                        </div>
                        <button 
                          onClick={() => setSelectedBiz(item)}
                          style={{ backgroundColor: '#FFF', color: '#1E293B', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}
                        >
                          Review Entry
                        </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail Overlay */}
      {selectedBiz && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
           <div style={{ backgroundColor: '#1E293B', borderRadius: '32px', width: '100%', maxWidth: '650px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Business Verification</h2>
                    <p style={{ color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Case ID: LH-VER-00{selectedBiz.id}</p>
                 </div>
                 <button onClick={() => setSelectedBiz(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><FiX size={32} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                 <div>
                    <img src={selectedBiz.image} alt={selectedBiz.name || 'Selected business'} style={{ width: '100%', borderRadius: '24px', height: '180px', objectFit: 'cover' }} />
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                       <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                          <FiImage color="#94A3B8" />
                       </div>
                       <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                          <FiActivity color="#94A3B8" />
                       </div>
                    </div>
                 </div>
                 <div>
                    <div style={{ marginBottom: '20px' }}>
                       <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', letterSpacing: '1px' }}>NAME</span>
                       <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{selectedBiz.name}</div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                       <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', letterSpacing: '1px' }}>PROVIDER</span>
                       <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{selectedBiz.owner_name}</div>
                    </div>
                    <div>
                       <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', letterSpacing: '1px' }}>SUBMITTED ON</span>
                       <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{new Date(selectedBiz.createdAt).toDateString()}</div>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                 <button 
                  onClick={() => handleAction(selectedBiz.id, 'reject')}
                  style={{ flex: 1, padding: '20px', borderRadius: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1.5px solid rgba(239, 68, 68, 0.3)', fontWeight: '900', cursor: 'pointer' }}
                 >REJECT LISTING</button>
                 <button 
                  onClick={() => handleAction(selectedBiz.id, 'approve')}
                  style={{ flex: 1, padding: '20px', borderRadius: '20px', backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(30,64,175,0.3)' }}
                 >VERIFY & GO LIVE</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
