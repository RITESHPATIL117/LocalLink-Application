'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { 
  FiArrowLeft, FiMoreVertical, FiPaperclip, FiSend, FiCheck, FiCheckCircle, FiClock, FiShield
} from 'react-icons/fi';
import chatService from '../../../services/chatService';
import Link from 'next/link';

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params.id;
  const chatName = searchParams.get('name') || 'Local Specialist';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial fetch of messages mock
    setMessages([
      { id: '1', text: 'Hello, are you available today for a plumbing leak?', sender: 'other', time: '10:30 AM', status: 'read' },
      { id: '2', text: 'Yes, I can come by at around 2 PM to assess the damage.', sender: 'me', time: '10:35 AM', status: 'read' },
      { id: '3', text: 'That works great! I have the parts ready in the garage.', sender: 'other', time: '10:40 AM', status: 'read' },
    ]);
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate auto-scrolling
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Elite Chat Header Parity */}
      <header style={{ 
        backgroundColor: '#FFF', padding: '16px 24px', borderBottom: '1px solid #F1F5F9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} style={{ backgroundColor: '#F8FAFC', width: '44px', height: '44px', borderRadius: '14px', border: 'none', color: '#1E293B', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FiArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', overflow: 'hidden' }}>
              <img src={`https://ui-avatars.com/api/?name=${chatName}&background=random`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{chatName}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '700' }}>Active Now</span>
              </div>
            </div>
          </div>
        </div>
        <button style={{ backgroundColor: '#F8FAFC', width: '44px', height: '44px', borderRadius: '14px', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FiMoreVertical size={20} />
        </button>
      </header>

      {/* 2. Messages Ledger (Scrollable Area) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px' }} className="no-scrollbar">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#F1F5F9', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', margin: '0 auto' }}>
               <FiShield size={14} color="#64748B" />
               <span style={{ fontSize: '11px', fontWeight: '900', color: '#64748B', letterSpacing: '0.5px' }}>END-TO-END ENCRYPTED</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                   <div style={{ 
                     padding: '16px 20px', borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                     backgroundColor: isMe ? 'var(--color-primary)' : '#FFF',
                     color: isMe ? '#FFF' : '#1E293B',
                     boxShadow: '0 8px 16px rgba(0,0,0,0.03)',
                     border: isMe ? 'none' : '1px solid #F1F5F9'
                   }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>{msg.text}</div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#94A3B8', fontSize: '11px', fontWeight: '800' }}>
                      {msg.time} {isMe && <FiCheckCircle size={12} color={msg.status === 'read' ? 'var(--color-primary)' : '#94A3B8'} />}
                   </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 3. Elite Input Bar Parity */}
      <footer style={{ backgroundColor: '#FFF', borderTop: '1px solid #F1F5F9', padding: '24px', zIndex: 100 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
           <button style={{ backgroundColor: '#F8FAFC', width: '56px', height: '56px', borderRadius: '18px', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <FiPaperclip size={24} />
           </button>
           
           <div style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1.5px solid #F1F5F9', padding: '8px 20px', display: 'flex', alignItems: 'flex-end' }}>
              <textarea 
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Secure message..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '8px 0', fontSize: '16px', fontWeight: '600', resize: 'none', color: '#1E293B', minHeight: '24px', height: '36px' }}
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim()}
                style={{ 
                  backgroundColor: 'var(--color-primary)', width: '44px', height: '44px', borderRadius: '14px', border: 'none', 
                  color: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '12px',
                  opacity: message.trim() ? 1 : 0.5, cursor: message.trim() ? 'pointer' : 'default',
                  boxShadow: '0 8px 20px rgba(30,64,175,0.2)'
                }}
              >
                <FiSend size={20} />
              </button>
           </div>
        </div>
      </footer>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
