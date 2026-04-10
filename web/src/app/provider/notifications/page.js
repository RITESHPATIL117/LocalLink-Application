'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import leadService from '../../../services/leadService';

export default function ProviderNotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'provider') {
      router.push('/login');
      return;
    }
    leadService.getUserLeads().then((res) => setLeads(res?.data || [])).catch(() => setLeads([]));
  }, [isAuthenticated, user, router]);

  const items = useMemo(
    () =>
      leads.slice(0, 12).map((lead) => ({
        id: lead.id,
        title: `${lead.service || 'Service'} request update`,
        text: `Status: ${lead.status || 'Pending'} • ${lead.address || 'Sangli'}`,
      })),
    [leads]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Provider Notifications</h1>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No notifications yet.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-4">
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 mt-1">{item.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
