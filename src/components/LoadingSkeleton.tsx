import React from 'react';

interface LoadingSkeletonProps {
  lines?: number;
  width?: string;
  height?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ lines = 3, width, height }) => {
  return (
    <div style={{ padding: '8px 0' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: height || '12px',
            width: width || (i === lines - 1 ? '60%' : '100%'),
            background: '#1a1a1a',
            marginBottom: '10px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </div>
  );
};

export default LoadingSkeleton;
