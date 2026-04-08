'use client';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon,
}) {
  
  const variants = {
    primary: 'bg-primary text-white shadow-glow hover:brightness-110',
    secondary: 'bg-amber-500 text-white shadow-glow-secondary hover:brightness-110',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5',
    dark: 'bg-slate-900 text-white shadow-lg hover:bg-slate-800',
    danger: 'bg-red-500 text-white shadow-glow-red hover:brightness-110',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
  };

  const currentVariant = disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] 
        transition-all flex items-center justify-center gap-3 relative overflow-hidden
        ${currentVariant}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
