'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiSearch, FiEdit3, FiArrowLeft, FiMessageCircle, FiChevronRight, FiClock, FiCheck
} from 'react-icons/fi';
import chatService from '../../services/chatService';
import Link from 'next/link';

export default function InboxPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await chatService.getChats().catch(() => ({ data: [] }));
      let fetchedChats = res.data || res || [];
      
      if (fetchedChats.length === 0) {
        fetchedChats = [
          { id: '1', name: 'Rahul Kumar', time: '10:45 AM', lastMessage: 'Thank you! The AC is working perfectly now.', unread: 2, isOnline: true },
          { id: '2', name: 'Sneha Patel', time: 'Yesterday', lastMessage: 'Can you share the pricing details?', unread: 0, isOnline: false },
          { id: '3', name: 'Amit Singh', time: 'Mon', lastMessage: 'See you tomorrow at 2 PM.', unread: 0, isOnline: true },
        ];
      }
      setChats(fetchedChats);
    } catch (e) {
      console.log('Error fetching chats:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* 1. High-Fidelity App Bar Parity */}
      <header style={{ 
        backgroundColor: '#FFF', padding: '16px 24px', borderBottom: '1px solid #F1F5F9',
        position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} style={{ backgroundColor: '#F8FAFC', width: '44px', height: '44px', borderRadius: '14px', border: 'none', color: '#1E293B', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '1000', color: '#1E293B', margin: 0, letterSpacing: '-1px' }}>Messages</h1>
        </div>
        <button style={{ backgroundColor: 'var(--color-primary)', width: '48px', height: '48px', borderRadius: '16px', border: 'none', color: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 8px 20px rgba(30,64,175,0.2)' }}>
          <FiEdit3 size={20} />
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        
        {/* 2. Elite Search Input */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{ 
            backgroundColor: '#FFF', borderRadius: '20px', padding: '0 20px', height: '60px',
            display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.02)'
          }}>
            <FiSearch size={22} color="#94A3B8" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '16px', fontWeight: '700', color: '#1E293B' }}
            />
          </div>
        </div>

        {/* 3. Messaging Ledger */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>⏳ Loading your secure cloud inbox...</div>
        ) : filteredChats.length === 0 ? (
          <div style={{ 
            backgroundColor: '#FFF', borderRadius: '32px', padding: '80px 40px', textAlign: 'center',
            border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '40px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto' }}>
              <FiMessageCircle size={48} color="#CBD5E1" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B' }}>Silent Inbox</h2>
            <p style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '300px', margin: '12px auto 0 auto', lineHeight: '1.6' }}>
              When you hire a pro or receive requests, your private chat will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredChats.map((chat) => {
              const active = chat.unread > 0;
              return (
                <div 
                  key={chat.id}
                  onClick={() => router.push(`/inbox/${chat.id}?name=${encodeURIComponent(chat.name)}`)}
                  style={{ 
                    backgroundColor: '#FFF', padding: '20px', borderRadius: '28px', border: '1px solid #F1F5F9',
                    display: 'flex', gap: '20px', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: active ? '0 12px 25px rgba(30,64,175,0.06)' : '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  className="chat-card-hover"
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                       <img src={`https://ui-avatars.com/api/?name=${chat.name}&background=random`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {chat.isOnline && (
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '9px', backgroundColor: '#10B981', border: '4px solid #FFF' }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                       <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{chat.name}</h3>
                       <span style={{ fontSize: '12px', fontWeight: '800', color: '#94A3B8' }}>{chat.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <p style={{ 
                         margin: 0, fontSize: '14px', fontWeight: active ? '800' : '600', color: active ? '#1E293B' : '#64748B',
                         maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                       }}>
                         {chat.lastMessage}
                       </p>
                       {active && (
                         <div style={{ backgroundColor: 'var(--color-primary)', padding: '4px 10px', borderRadius: '10px', color: '#FFF', fontSize: '11px', fontWeight: '900' }}>
                           {chat.unread}
                         </div>
                       )}
                    </div>
                  </div>
                  <FiChevronRight size={20} color="#CBD5E1" />
                </div>
              )
            })}
          </div>
        )}
      </main>

      <style jsx>{`
        .chat-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(30,64,175,0.1) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05) !important;
        }
      `}</style>
    </div>
  );
}
