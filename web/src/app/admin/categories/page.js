'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import categoryService from '../../../services/categoryService';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }

    categoryService
      .getCategories()
      .then((res) => setCategories(res?.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Category Registry</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-sm font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-slate-400">Loading categories...</div>
          ) : (
            <div className="divide-y divide-white/10">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{cat.name}</p>
                    <p className="text-xs text-slate-400">ID: {cat.id}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                    Active
                  </span>
                </div>
              ))}
              {categories.length === 0 && <div className="p-6 text-sm text-slate-400">No categories available.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
