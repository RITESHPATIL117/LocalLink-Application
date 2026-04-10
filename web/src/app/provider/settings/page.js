'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../store/authSlice';

function SettingRow({ icon, label, desc, value, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#FFF5F0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', fontSize: '20px' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B', marginBottom: '2px' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>{desc}</div>
        </div>
      </div>
      <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
        <input 
          type="checkbox" 
          checked={value} 
          onChange={(e) => onToggle(e.target.checked)} 
          style={{ opacity: 0, width: 0, height: 0 }} 
        />
        <span style={{
          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: value ? 'var(--color-primary)' : '#E2E8F0',
          transition: '.4s', borderRadius: '34px'
        }}>
          <span style={{
            position: 'absolute', height: '20px', width: '20px', left: value ? '26px' : '4px', bottom: '4px',
            backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
          }} />
        </span>
      </label>
    </div>
  );
}

function ActionRow({ icon, label, desc, onClick }) {
  return (
    <div 
      onClick={onClick} 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', cursor: 'pointer', transition: 'background-color 0.2s' }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#FFF5F0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '16px', fontSize: '20px' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B', marginBottom: '2px' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>{desc}</div>
        </div>
      </div>
      <span style={{ color: '#CBD5E1', fontSize: '20px' }}>›</span>
    </div>
  );
}

export default function ProviderSettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#FFF', padding: '24px', borderBottom: '1px solid #F1F5F9', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px', margin: 0 }}>System Settings</h1>
      </div>

      <div className="container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
        
        {/* Communications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '10px', marginLeft: '4px' }}>
          <span style={{ color: 'var(--color-primary)' }}>🔔</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' }}>Communications</span>
        </div>
        <div style={{ backgroundColor: '#FFF', borderRadius: '28px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 4px 15px rgba(30,41,59,0.02)', marginBottom: '24px' }}>
          <SettingRow icon="📲" label="Push Delivery" desc="Get instant lead & payment alerts" value={notifications} onToggle={setNotifications} />
          <div style={{ height: '1.5px', backgroundColor: '#F8FAFC', margin: '0 20px' }} />
          <SettingRow icon="📧" label="Electronic Mail" desc="Monthly performance summaries" value={emailAlerts} onToggle={setEmailAlerts} />
        </div>

        {/* Security & Privacy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '10px', marginLeft: '4px' }}>
          <span style={{ color: 'var(--color-primary)' }}>🛡️</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' }}>Security & Privacy</span>
        </div>
        <div style={{ backgroundColor: '#FFF', borderRadius: '28px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 4px 15px rgba(30,41,59,0.02)', marginBottom: '24px' }}>
          <ActionRow icon="🔒" label="Credentials" desc="Update your secure password" onClick={() => alert('Credential management syncing...')} />
          <div style={{ height: '1.5px', backgroundColor: '#F8FAFC', margin: '0 20px' }} />
          <ActionRow icon="👤" label="Biometric Access" desc="Unlock app with FaceID / TouchID" onClick={() => alert('Hardware handshake in progress...')} />
        </div>

        {/* Assistance & Legal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '10px', marginLeft: '4px' }}>
          <span style={{ color: 'var(--color-primary)' }}>🆘</span>
          <span style={{ fontSize: '13px', fontWeight: '900', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase' }}>Assistance & Legal</span>
        </div>
        <div style={{ backgroundColor: '#FFF', borderRadius: '28px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 4px 15px rgba(30,41,59,0.02)', marginBottom: '24px' }}>
          <ActionRow icon="❓" label="Knowledge Base" desc="Frequently asked questions" onClick={() => router.push('/support')} />
          <div style={{ height: '1.5px', backgroundColor: '#F8FAFC', margin: '0 20px' }} />
          <ActionRow icon="📄" label="Subscription Terms" desc="View your service agreement" onClick={() => {}} />
        </div>

        <button 
          onClick={() => { dispatch(logoutUser()); router.push('/login'); }}
          style={{ width: '100%', backgroundColor: '#FFF', margin: '10px 0', padding: '20px', borderRadius: '24px', border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.03)', cursor: 'pointer' }}
        >
          <span style={{ marginRight: '10px', fontSize: '20px' }}>🚪</span>
          <span style={{ color: '#EF4444', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminate Session</span>
        </button>

        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '0.5px' }}>LocalHub Elite Pro • v2.1.0-gold</div>
          <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '6px', fontWeight: '900', letterSpacing: '1.5px' }}>PURPLE LABS • © 2026</div>
        </div>

      </div>
    </div>
  );
}
