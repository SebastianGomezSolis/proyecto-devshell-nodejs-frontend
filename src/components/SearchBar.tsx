import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder, onClear }) => {
  return (
    <div style={{ position: 'relative', maxWidth: '350px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'buscar...'}
        style={{ fontSize: '12px', paddingRight: '30px' }}
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.(); }}
          style={{
            position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: '#504f4a', cursor: 'pointer',
            fontFamily: 'JetBrains Mono', fontSize: '12px', padding: '4px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
