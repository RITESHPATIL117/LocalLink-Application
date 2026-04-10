'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, FiUser, FiLock, FiShield, FiBell, 
  FiMapPin, FiInfo, FiFileText, FiLogOut, FiChevronRight 
} from 'react-icons/fi';

function SettingItem({ icon, title, type = 'chevron', value, onValueChange, onClick, destructive }) {
  return (
    <motion.div 
      whileHover={type !== 'switch' ? { x: 4 } : {}}
      onClick={type !== 'switch' ? onClick : undefined}
      className={`
        flex items-center justify-between p-5 rounded-[24px] mb-3 transition-all
        ${type !== 'switch' ? 'cursor-pointer' : 'cursor-default'}
        ${destructive ? 'bg-red-50 hover:bg-red-100 border border-red-100' : 'bg-white hover:bg-slate-50 border border-slate-100 shadow-subtle'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-2xl flex items-center justify-center text-xl
          ${destructive ? 'bg-red-500/10 text-red-500' : 'bg-slate-50 text-slate-500'}
        `}>
          {icon}
        </div>
        <span className={`text-base font-black tracking-tight ${destructive ? 'text-red-500' : 'text-slate-900'}`}>{title}</span>
      </div>
      
      {type === 'chevron' && <FiChevronRight className={destructive ? 'text-red-300' : 'text-slate-300'} size={24} />}
      {type === 'switch' && (
        <button 
          onClick={() => onValueChange(!value)}
          className={`
            relative w-[52px] h-[32px] rounded-full transition-colors duration-300
            ${value ? 'bg-primary' : 'bg-slate-200'}
          `}
        >
          <motion.div 
            layout
            initial={false}
            animate={{ 
              x: value ? 22 : 4,
              backgroundColor: '#fff'
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 bottom-1 w-[24px] h-[24px] rounded-full shadow-sm"
          />
        </button>
      )}
    </motion.div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth || {});
  
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  const handleLogout = () => {
    if (dispatch && logoutUser) {
      dispatch(logoutUser());
    }
    router.push('/login');
  };

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-6 shadow-subtle">
        <div className="section-container max-w-3xl flex items-center gap-6">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => router.back()} 
            className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
          >
            <FiChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Settings</h1>
        </div>
      </header>

      <main className="section-container max-w-3xl py-12 flex-grow">
        
        <section className="mb-12">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Account Configuration</h2>
          <SettingItem icon={<FiUser />} title="Edit Profile" onClick={() => router.push('/profile')} />
          <SettingItem icon={<FiLock />} title="Change Password" onClick={() => alert('Password management module integrated in v4.1')} />
          <SettingItem icon={<FiShield />} title="Privacy & Security" onClick={() => router.push('/support')} />
        </section>

        <section className="mb-12">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">System Preferences</h2>
          <SettingItem icon={<FiBell />} title="Push Notifications" type="switch" value={notifications} onValueChange={setNotifications} />
          <SettingItem icon={<FiMapPin />} title="Location Access" type="switch" value={location} onValueChange={setLocation} />
        </section>

        <section className="mb-12">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Information & Legal</h2>
          <SettingItem icon={<FiInfo />} title="About LocalHub Elite" onClick={() => router.push('/about')} />
          <SettingItem icon={<FiFileText />} title="Terms of Service" onClick={() => router.push('/terms')} />
        </section>

        <section className="mt-16">
          <SettingItem 
            icon={<FiLogOut />} 
            title="Terminate Session" 
            destructive 
            onClick={handleLogout} 
          />
        </section>

        <p className="text-center mt-16 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
           LocalHub Elite Console &copy; {new Date().getFullYear()}
        </p>

      </main>
    </div>
  );
}
