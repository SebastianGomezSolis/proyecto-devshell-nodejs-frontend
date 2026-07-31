import React from 'react';

interface KbdProps {
  keys: string[];
}

const Kbd: React.FC<KbdProps> = ({ keys }) => {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#504f4a', fontSize: '10px' }}>+</span>}
          <kbd style={{
            display: 'inline-block',
            padding: '2px 6px',
            fontSize: '9px',
            color: '#a0a09a',
            background: '#111',
            border: '1px solid #2a2a2a',
            fontFamily: 'JetBrains Mono',
            lineHeight: 1.4,
          }}>
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </span>
  );
};

export default Kbd;
