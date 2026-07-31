import React, { useState, useEffect, useCallback } from 'react';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastId = 0;
const listeners: Set<(toast: ToastItem) => void> = new Set();

export function showToast(type: ToastItem['type'], message: string) {
  const toast: ToastItem = { id: String(++toastId), type, message };
  listeners.forEach(fn => fn(toast));
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: ToastItem) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => { listeners.delete(addToast); };
  }, [addToast]);

  const colors: Record<string, string> = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#f59e0b',
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '16px', right: '16px',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      gap: '8px', maxWidth: '360px',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: '#111', border: `1px solid ${colors[t.type]}`,
          padding: '10px 14px', fontSize: '11px',
          color: colors[t.type],
          display: 'flex', gap: '8px', alignItems: 'flex-start',
          animation: 'slideIn 0.2s ease-out',
        }}>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            style={{
              background: 'none', border: 'none', color: '#504f4a',
              cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: 0,
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
