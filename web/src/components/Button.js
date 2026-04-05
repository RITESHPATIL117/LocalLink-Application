'use client';
import { useState } from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Gradient definitions mapping mobile Button.js getGradient()
  let background = 'linear-gradient(to right, #0F172A, #1E3A8A)';
  if (disabled) background = 'linear-gradient(to right, #9CA3AF, #6B7280)';
  else if (variant === 'secondary') background = 'linear-gradient(to right, #F59E0B, #B45309)';
  else if (variant === 'outline') background = 'transparent';

  const defaultStyle = {
    padding: '18px 28px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0',
    background,
    border: variant === 'outline' ? '2px solid var(--color-primary)' : 'none',
    boxShadow: disabled || variant === 'outline' ? 'none' : '0 10px 20px rgba(30, 64, 175, 0.3)',
    color: variant === 'outline' ? 'var(--color-primary)' : '#FFFFFF',
    fontSize: '14px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transform: isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={defaultStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', ...textStyle }}>
          <span style={styles.spinner}></span>
          Processing...
        </span>
      ) : (
        <span style={textStyle}>{children}</span>
      )}
    </button>
  );
}

const styles = {
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  }
};
