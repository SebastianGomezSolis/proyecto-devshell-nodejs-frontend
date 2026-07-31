import React from 'react';

interface EmptyStateProps {
  icon?: string;
  message: string;
  hint?: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, hint, action }) => {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '28px', marginBottom: '10px' }}>
        {icon || '∅'}
      </div>
      <div style={{ fontSize: '13px', color: '#a0a09a' }}>{message}</div>
      {hint && (
        <div style={{ fontSize: '10px', color: '#504f4a', marginTop: '6px' }}>
          {hint}
        </div>
      )}
      {action && (
        <button
          className="btn-primary"
          onClick={action.onClick}
          style={{ fontSize: '11px', padding: '6px 16px', marginTop: '14px' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
