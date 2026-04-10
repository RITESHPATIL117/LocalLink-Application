'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../../../store/authSlice';

export default function ProviderProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 ',
    businessName: 'LocalHub Pro Services',
    bio: 'Experienced local provider delivering quality services.',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'provider') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">Provider Profile</h1>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Email</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50" value={profile.email} disabled />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Phone</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Business Name</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Bio</label>
            <textarea className="w-full rounded-xl border border-slate-200 px-4 py-3 min-h-28" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button className="btn-premium !rounded-full px-6 py-3 text-sm">Save Securely</button>
            <button
              onClick={() => {
                dispatch(logoutUser());
                router.push('/login');
              }}
              className="rounded-full border border-red-200 bg-red-50 text-red-600 px-6 py-3 text-sm font-bold"
            >
              Relinquish Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
