import React from 'react';

interface BadgeProps {
  text: string;
  color?: string;
  bg?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles: Record<string, { color: string; bg: string }> = {
  default: { color: '#a0a09a', bg: '#161610' },
  success: { color: '#22c55e', bg: '#052e16' },
  warning: { color: '#f59e0b', bg: '#161610' },
  danger: { color: '#ef4444', bg: '#160a0a' },
  info: { color: '#3b82f6', bg: '#0a1628' },
};

const Badge: React.FC<BadgeProps> = ({ text, color, bg, variant = 'default' }) => {
  const vs = variantStyles[variant];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '9px',
        padding: '2px 8px',
        border: `1px solid ${color || vs.color}44`,
        color: color || vs.color,
        background: bg || vs.bg,
        marginRight: '4px',
        marginTop: '2px',
      }}
    >
      {text}
    </span>
  );
};

export default Badge;
