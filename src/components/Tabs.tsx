import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', borderBottom: '1px solid #2a2a2a', paddingBottom: '8px' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={active === tab.id ? 'btn-primary' : 'btn-secondary'}
          onClick={() => onChange(tab.id)}
          style={{ fontSize: '10px', padding: '4px 12px', textTransform: 'capitalize' }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{ marginLeft: '6px', opacity: 0.7 }}>({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
