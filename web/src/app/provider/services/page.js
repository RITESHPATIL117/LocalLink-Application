'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/Button';
import InputField from '../../../components/InputField';

export default function ProviderServices() {
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Dummy data representing fetched business services
  const [services, setServices] = useState([
    { id: 1, name: 'Premium Full Inspection', price: 999, description: 'Comprehensive diagnostic of all related aspects.' },
    { id: 2, name: 'Basic Maintenance', price: 499, description: 'Standard maintenance protocol for general safety.' }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated || user?.role !== 'provider') {
        router.push('/login');
      }
    }
  }, [mounted, authLoading, isAuthenticated, user, router]);

  if (!mounted || authLoading || !isAuthenticated) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Provider Services...</div>;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (newService.name && newService.price) {
      setServices([...services, { id: Date.now(), ...newService }]);
      setNewService({ name: '', price: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '30px', padding: '40px 20px' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: 'var(--color-primary)' }}>Provider Menu</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li><Link href="/provider/dashboard" style={{ fontWeight: '600', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Overview</Link></li>
            <li><a href="/provider/dashboard#leads" style={{ fontWeight: '600', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>My Leads</a></li>
            <li><Link href="/provider/services" style={{ fontWeight: '800', color: 'var(--color-primary)', textDecoration: 'none' }}>Services Console</Link></li>
          </ul>
        </div>
      </aside>

      {/* Main Block */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-text)' }}>Services Console</h1>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>+ Add New Service</Button>
          )}
        </div>

        {isAdding && (
          <div className="card" style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Add New Service</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 2 }}>
                  <InputField 
                    label="Service Name" 
                    value={newService.name} 
                    onChange={e => setNewService({...newService, name: e.target.value})} 
                    placeholder="e.g. Deep Cleaning" required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField 
                    label="Base Price (₹)" 
                    type="number" 
                    value={newService.price} 
                    onChange={e => setNewService({...newService, price: e.target.value})} 
                    placeholder="499" required 
                  />
                </div>
              </div>
              <div style={{ marginVertical: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  placeholder="Describe your service in detail..."
                  style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1.5px solid var(--color-border)', backgroundColor: 'var(--color-surface-secondary)', fontFamily: 'inherit', resize: 'vertical' }}
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Save Service</Button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {services.map(service => (
            <div key={service.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }}>{service.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>{service.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-primary)', marginBottom: '12px' }}>₹{service.price}</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(service.id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
