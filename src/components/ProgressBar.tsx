import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value, max = 100, color = '#f59e0b', height = 4,
  showLabel, animated = true,
}) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: `${height}px`, background: '#1a1a1a' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            transition: animated ? 'width 600ms ease-out' : 'none',
          }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: '10px', color: '#504f4a', width: '30px', textAlign: 'right', flexShrink: 0 }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
