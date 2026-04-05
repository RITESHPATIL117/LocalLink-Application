'use client';
import { useState } from 'react';

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required,
  style,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;

  return (
    <div style={{ marginVertical: '12px', ...style }}>
      {label && (
        <label style={styles.label}>
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <div 
        style={{
          ...styles.inputContainer,
          borderColor: error ? 'var(--color-error)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)',
          backgroundColor: isFocused ? 'var(--color-surface)' : 'var(--color-surface-secondary)',
          transform: isFocused ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isFocused ? '0 0 0 4px rgba(30, 64, 175, 0.1)' : 'none',
        }}
      >
        <input
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    marginLeft: '4px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderRadius: '16px',
    padding: '0 16px',
    height: '60px',
    transition: 'all 0.2s ease',
    marginBottom: '8px',
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'var(--color-text)',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
  },
  iconContainer: {
    padding: '8px',
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  errorText: {
    display: 'block',
    color: 'var(--color-error)',
    fontSize: '12px',
    fontWeight: '700',
    marginTop: '6px',
    marginLeft: '4px',
  },
};
