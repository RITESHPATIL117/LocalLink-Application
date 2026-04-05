'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiUser, FiMail, FiMapPin, FiBriefcase, FiArrowRight, FiSettings, 
  FiHeart, FiClipboard, FiHeadphones, FiLogOut, FiEdit3, FiShield
} from 'react-icons/fi';
import { logoutUser } from '../../store/authSlice';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(logoutUser());
      router.push('/login');
    }
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* 1. Profile Header area */}
      <header style={{ 
        background: 'linear-gradient(135deg, var(--color-primary), #4338CA)', 
        height: '300px', position: 'relative', overflow: 'hidden' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <button onClick={() => router.back()} style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '44px', height: '44px', borderRadius: '14px', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <FiArrowRight size={22} style={{ transform: 'rotate(180deg)' }} />
             </button>
             <button style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '44px', height: '44px', borderRadius: '14px', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FiSettings size={20} />
             </button>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
             <div style={{ position: 'relative' }}>
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '40px', backgroundColor: '#FFF', 
                  border: '6px solid rgba(255,255,255,0.3)', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                   <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   />
                </div>
                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#FFF', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                   <FiEdit3 color="var(--color-primary)" size={18} />
                </div>
             </div>
             
             <div>
                <h1 style={{ fontSize: '32px', fontWeight: '1000', color: '#FFF', margin: 0, letterSpacing: '-0.5px' }}>{user?.name || 'LocalHub Elite User'}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                   <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px' }}>
                     {(user?.role || 'CUSTOMER').toUpperCase()}
                   </span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>
                      <FiMapPin size={14} /> Sangli, IN
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Background Decorative Circles Parity */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '150px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </header>

      <main style={{ maxWidth: '800px', margin: '-40px auto 100px auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* 2. Account Overview Metrics */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
           {[
             { label: 'Bookings', count: '12', icon: <FiClipboard /> },
             { label: 'Favorites', count: '8', icon: <FiHeart /> },
             { label: 'Support', count: '24/7', icon: <FiHeadphones /> },
           ].map(metric => (
             <div key={metric.label} style={{ 
               backgroundColor: '#FFF', padding: '24px', borderRadius: '24px', border: '1px solid #F1F5F9',
               display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
             }}>
                <div style={{ fontSize: '24px', fontWeight: '1000', color: '#1E293B' }}>{metric.count}</div>
                <div style={{ fontSize: '11px', fontWeight: '900', color: '#94A3B8', marginTop: '4px', textTransform: 'uppercase' }}>{metric.label}</div>
             </div>
           ))}
        </section>

        {/* 3. Personalized Menu List */}
        <section style={{ backgroundColor: '#FFF', borderRadius: '32px', border: '1px solid #F1F5F9', overflow: 'hidden', padding: '12px' }}>
           {[
             { label: 'My Bookings', ic: <FiClipboard color="#F59E0B" />, route: '/requests' },
             { label: 'Saved Professionals', ic: <FiHeart color="#EF4444" />, route: '/favorites' },
             { label: 'Account Settings', ic: <FiSettings color="#6366F1" />, route: '/settings' },
             { label: 'Help & Support', ic: <FiHeadphones color="#10B981" />, route: '/support' },
             { label: 'Privacy & Security', ic: <FiShield color="#8B5CF6" />, route: '#' },
           ].map((item, idx) => (
             <Link href={item.route} key={item.label} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: idx === 4 ? 'none' : '1px solid #F1F5F9', cursor: 'pointer'
                }} className="menu-item-hover">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
                        {item.ic}
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B' }}>{item.label}</span>
                   </div>
                   <FiChevronRight color="#CBD5E1" size={20} />
                </div>
             </Link>
           ))}
        </section>

        {user?.role === 'provider' && (
          <section style={{ marginTop: '24px' }}>
            <Link href="/provider/dashboard" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '24px', padding: '24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF',
                boxShadow: '0 8px 20px rgba(16,185,129,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <FiBriefcase size={28} />
                   <div>
                     <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>Provider Dashboard</h4>
                     <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.8, fontWeight: '600' }}>Manage your listings & earnings</p>
                   </div>
                </div>
                <FiArrowRight size={24} />
              </div>
            </Link>
          </section>
        )}

        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%', marginTop: '32px', backgroundColor: '#FEF2F2', border: '1.5px solid #FCA5A5',
            padding: '20px', borderRadius: '24px', color: '#EF4444', fontWeight: '900', fontSize: '16px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer'
          }}
        >
          <FiLogOut /> SIGN OUT
        </button>

      </main>

      <style jsx>{`
        .menu-item-hover:hover {
          background-color: #F8FAFC;
        }
      `}</style>
    </div>
  );
}
