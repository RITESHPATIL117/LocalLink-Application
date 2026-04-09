'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required,
  className = '',
  icon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors duration-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        className={`
          flex items-center relative transition-all duration-300 border rounded-2xl shadow-subtle
          ${error 
            ? 'border-red-200 bg-red-50/10 focus-within:border-red-500' 
            : isFocused 
              ? 'border-primary ring-4 ring-primary/5 bg-white shadow-premium' 
              : 'border-slate-100 bg-slate-50 focus-within:bg-white'}
        `}
      >
        {icon && (
          <div className={`pl-5 pr-2 transition-colors ${isFocused ? 'text-primary' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}
        
        <input
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full py-3.5 px-5 bg-transparent border-none outline-none 
            font-semibold text-slate-800 placeholder:text-slate-300 transition-all text-sm
            ${icon ? 'pl-2' : ''}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-5 pl-2 text-slate-400 hover:text-primary transition-colors flex items-center"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
