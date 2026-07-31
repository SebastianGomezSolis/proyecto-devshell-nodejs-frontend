import React from 'react';

interface StatusDotProps {
  active?: boolean;
  color?: string;
  size?: number;
  label?: string;
}

const StatusDot: React.FC<StatusDotProps> = ({ active, color, size = 8, label }) => {
  const dotColor = color || (active ? '#22c55e' : '#2a2a2a');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: `${size}px`, height: `${size}px`,
          background: dotColor,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label && <span style={{ fontSize: '10px', color: '#a0a09a' }}>{label}</span>}
    </span>
  );
};

export default StatusDot;
