import React, { useEffect, useRef } from 'react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ open, onClose, title, children, width }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handler);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.8)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={{
        background: '#111', border: '1px solid #2a2a2a',
        width: width || '480px', maxWidth: '90vw', maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 16px',
          borderBottom: '1px solid #2a2a2a',
        }}>
          <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 500 }}>{title}</div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#504f4a', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;
