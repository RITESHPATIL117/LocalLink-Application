'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import chatService from '../../../services/chatService';

export default function ProviderChatsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'provider') {
      router.push('/login');
      return;
    }

    const loadChats = async () => {
      try {
        const res = await chatService.getChats();
        setChats(res?.data || res || []);
      } catch (_) {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">Provider Messages</h1>
          <button
            onClick={() => router.push('/provider/dashboard')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 text-slate-500 text-sm">Loading conversations...</div>
          ) : chats.length === 0 ? (
            <div className="p-6 text-slate-500 text-sm">No active conversations yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => router.push(`/inbox/${chat.id}?name=${encodeURIComponent(chat.name || 'Customer')}`)}
                  className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{chat.name || 'Customer'}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
                    </div>
                    <p className="text-xs text-slate-400">{chat.time || 'Now'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
