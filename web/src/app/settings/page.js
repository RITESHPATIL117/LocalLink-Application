'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../store/authSlice';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth || {});
  
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (dispatch && logoutUser) {
      dispatch(logoutUser());
    }
    router.push('/login');
  };

  if (!mounted) return null;

  const SettingItem = ({ icon, title, type = 'chevron', value, onValueChange, onClick }) => (
    <div 
      onClick={type !== 'switch' ? onClick : undefined}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        backgroundColor: '#FFF', padding: '16px', borderRadius: '16px', 
        marginBottom: '12px', cursor: type !== 'switch' ? 'pointer' : 'default',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', color: 'var(--color-primary)', fontSize: '20px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{title}</span>
      </div>
      
      {type === 'chevron' && <span style={{ color: '#9CA3AF', fontSize: '20px' }}>›</span>}
      {type === 'switch' && (
        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
          <input 
            type="checkbox" 
            checked={value} 
            onChange={(e) => onValueChange(e.target.checked)} 
            style={{ opacity: 0, width: 0, height: 0 }} 
          />
          <span style={{
            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: value ? 'var(--color-primary)' : '#D1D5DB',
            transition: '.4s', borderRadius: '34px'
          }}>
            <span style={{
              position: 'absolute', height: '20px', width: '20px', left: value ? '26px' : '4px', bottom: '4px',
              backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
            }} />
          </span>
        </label>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: 0 }}>Settings</h1>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginLeft: '16px' }}>Account</div>
        <SettingItem icon="👤" title="Edit Profile" onClick={() => router.push('/profile/edit')} />
        <SettingItem icon="🔒" title="Change Password" onClick={() => alert('Password change coming soon.')} />
        <SettingItem icon="🛡️" title="Privacy Policy" onClick={() => router.push('/support')} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginLeft: '16px' }}>App Settings</div>
        <SettingItem icon="🔔" title="Push Notifications" type="switch" value={notifications} onValueChange={setNotifications} />
        <SettingItem icon="📍" title="Location Access" type="switch" value={location} onValueChange={setLocation} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', marginLeft: '16px' }}>More</div>
        <SettingItem icon="ℹ️" title="About LocalHub" onClick={() => router.push('/support')} />
        <SettingItem icon="📄" title="Terms of Service" onClick={() => router.push('/support')} />
      </div>

      <button 
        onClick={handleLogout}
        style={{ width: '100%', padding: '16px', backgroundColor: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', marginTop: '16px' }}
      >
        Log Out
      </button>

    </div>
  );
}
