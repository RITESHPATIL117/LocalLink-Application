'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiClock, FiMapPin, FiBriefcase } from 'react-icons/fi';
import businessOwnerService from '../../../services/businessOwnerService';

export default function ProviderServices() {
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated || user?.role !== 'provider') {
        router.push('/login');
      } else {
        fetchProviderBusinesses();
      }
    }
  }, [mounted, authLoading, isAuthenticated, user, router]);

  const fetchProviderBusinesses = async () => {
    setLoading(true);
    try {
      const response = await businessOwnerService.getBusinesses().catch(() => []);
      const rows = Array.isArray(response) ? response : (response?.data || []);
      setServices(rows);
    } catch (error) {
      console.error('Error loading provider businesses:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading || !isAuthenticated) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Provider Services...</div>;
  }

  return (
    <div className="section-container py-10">
      
      {/* Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sticky top-28 shadow-subtle">
            <h3 className="text-lg font-black mb-6 text-primary">Provider Menu</h3>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link href="/provider/dashboard" className="hover:text-primary">Overview</Link></li>
              <li><a href="/provider/dashboard#leads" className="hover:text-primary">My Leads</a></li>
              <li><Link href="/provider/services" className="text-primary">Services Console</Link></li>
            </ul>
          </div>
        </aside>

      {/* Main Block */}
      <main className="lg:col-span-9">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="page-title">Services Console</h1>
          <button
            onClick={() => router.push('/provider/dashboard')}
            className="btn-premium px-6 py-3 !rounded-2xl text-xs"
          >
            Go to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="ui-card p-10 text-center text-slate-500 font-semibold">Loading your businesses...</div>
        ) : services.length === 0 ? (
          <div className="ui-card p-10 text-center">
            <FiBriefcase className="mx-auto text-slate-300 mb-4" size={44} />
            <h3 className="text-xl font-black text-slate-900 mb-2">No businesses found</h3>
            <p className="text-slate-500 mb-6">Create your first business listing from the provider onboarding flow.</p>
            <button onClick={() => router.push('/provider/dashboard')} className="btn-premium px-6 py-3 !rounded-2xl text-xs">
              Open Provider Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {services.map((service) => (
              <div key={service.id} className="ui-card p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{service.name}</h3>
                  <p className="text-slate-500 text-sm mb-2">{service.description || 'No description added yet.'}</p>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><FiMapPin /> {service.city || 'Sangli'}</span>
                    <span className={`inline-flex items-center gap-1.5 ${service.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {service.is_verified ? <FiCheckCircle /> : <FiClock />}
                      {service.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black tracking-widest uppercase text-slate-400 mb-1">Category</div>
                  <div className="text-sm font-black text-primary">{service.category_name || 'General'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
