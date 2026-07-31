import React from 'react';
import ModalDialog from './ModalDialog';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title, message,
  confirmText = 'confirmar', cancelText = 'cancelar', danger, loading,
}) => {
  return (
    <ModalDialog open={open} onClose={onClose} title={title} width="360px">
      <div style={{ fontSize: '12px', color: '#a0a09a', lineHeight: 1.6, marginBottom: '18px' }}>
        {message}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button className="btn-secondary" onClick={onClose} style={{ fontSize: '10px', padding: '6px 14px' }}>
          {cancelText}
        </button>
        <button
          className="btn-primary"
          onClick={onConfirm}
          disabled={loading}
          style={{
            fontSize: '10px', padding: '6px 14px',
            background: danger ? '#ef4444' : undefined,
            color: danger ? '#fff' : undefined,
          }}
        >
          {loading ? 'procesando...' : confirmText}
        </button>
      </div>
    </ModalDialog>
  );
};

export default ConfirmDialog;
