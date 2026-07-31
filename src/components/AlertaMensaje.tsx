import React, { useEffect } from 'react';

export interface MensajeGlobal {
  tipo: 'success' | 'error' | 'info' | 'warning';
  texto: string;
}

interface AlertaMensajeProps {
  mensaje: MensajeGlobal | null;
  onCerrar: () => void;
}

const AlertaMensaje: React.FC<AlertaMensajeProps> = ({ mensaje, onCerrar }) => {
  useEffect(() => {
    if (mensaje && mensaje.tipo !== 'error') {
      const timer = setTimeout(onCerrar, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;

  const colors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    success: { border: '#22c55e44', bg: '#0a1a0a', text: '#22c55e', icon: '✓' },
    error: { border: '#ef444444', bg: '#1a0a0a', text: '#ef4444', icon: '✕' },
    info: { border: '#3b82f644', bg: '#0a0a1a', text: '#3b82f6', icon: 'ℹ' },
    warning: { border: '#f59e0b44', bg: '#1a1a0a', text: '#f59e0b', icon: '⚠' },
  };

  const c = colors[mensaje.tipo];

  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        background: c.bg,
        padding: '10px 14px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: c.text,
      }}
    >
      <span style={{ fontWeight: 700 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{mensaje.texto}</span>
      <button
        onClick={onCerrar}
        style={{
          background: 'none',
          border: 'none',
          color: c.text,
          cursor: 'pointer',
          fontFamily: 'JetBrains Mono',
          fontSize: '12px',
          opacity: 0.6,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default AlertaMensaje;
