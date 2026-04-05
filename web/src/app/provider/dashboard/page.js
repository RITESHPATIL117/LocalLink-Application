'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import leadService from '../../../services/leadService';
import Button from '../../../components/Button';
import { io } from 'socket.io-client';

export default function ProviderDashboard() {
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const router = useRouter();
  
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, rating: 4.8 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchLeads = async () => {
    try {
      if (!user?.id) return;
      // In a real scenario, providers have a businessID. 
      // We will mock fetching all leads since this translates the app's standard flow.
      // E.g. const res = await leadService.getLeadsByBusiness(user.business_id);
      
      // For now, let's use the local mock structure if API fails
      const res = await leadService.getUserLeads(); 
      const existingLeads = res.data || [];
      
      setLeads(existingLeads);
      
      setStats({
        active: existingLeads.filter(l => l.status === 'Pending').length,
        completed: existingLeads.filter(l => l.status === 'Completed').length,
        rating: 4.8
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated || user?.role !== 'provider') {
        router.push('/login');
      } else {
        fetchLeads();
      }
    }
  }, [mounted, authLoading, isAuthenticated, user, router]);

  // Hook up WebSockets
  useEffect(() => {
    if (!user?.business_id) return;
    
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000');
    socket.emit('joinRoom', `business_${user.business_id}`);
    
    socket.on('new_rfq_lead', () => fetchLeads());
    socket.on('booking_status_updated', () => fetchLeads());

    return () => socket.disconnect();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    await leadService.updateLeadStatus(id, status);
    fetchLeads();
  };

  if (!mounted || authLoading || loading || !isAuthenticated) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Provider Dashboard...</div>;
  }

  return (
    <div className="container" style={{ display: 'flex', gap: '30px', padding: '40px 20px' }}>
      <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: 'var(--color-primary)' }}>Provider Menu</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li><a href="#overview" style={{ fontWeight: '700', color: 'var(--color-text)' }}>Overview</a></li>
            <li><a href="#leads" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>My Leads</a></li>
            <li><a href="#services" style={{ fontWeight: '600', color: 'var(--color-text-secondary)' }}>Services</a></li>
          </ul>
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-text)' }}>Welcome, {user.name}</h1>
        </div>

        {/* Live Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div className="card"><h4 style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Active Leads</h4><div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-primary)' }}>{stats.active}</div></div>
          <div className="card"><h4 style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Completed</h4><div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-success)' }}>{stats.completed}</div></div>
          <div className="card"><h4 style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Rating</h4><div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-secondary)' }}>{stats.rating} ★</div></div>
        </div>

        {/* Live Leads */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>Recent Leads</h3>
          {leads.length === 0 ? (
             <p style={{ color: 'var(--color-text-secondary)', padding: '20px', textAlign: 'center' }}>No new leads today. Make sure your services are active!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leads.map(lead => (
                <div key={lead.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>{lead.service || 'General Service'}</h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{lead.date} at {lead.time} • 📍 {lead.address}</p>
                    <p style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic', maxWidth: '400px' }}>"{lead.description}"</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', backgroundColor: lead.status === 'Pending' ? '#FFFBEB' : '#ECFDF5', color: lead.status === 'Pending' ? '#F59E0B' : '#10B981', display: 'inline-block', marginBottom: '12px' }}>
                      {lead.status}
                    </div>
                    {lead.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="outline" onClick={() => handleUpdateStatus(lead.id, 'Cancelled')} style={{ padding: '6px 12px', fontSize: '12px' }}>Reject</Button>
                        <Button onClick={() => handleUpdateStatus(lead.id, 'Accepted')} style={{ padding: '6px 12px', fontSize: '12px' }}>Accept Lead</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
