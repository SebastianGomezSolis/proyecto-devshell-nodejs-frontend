import React, { useState } from 'react';
import { getSesion } from '../utils/auth';
import GlobalBanner from '../components/GlobalBanner';
import { showToast } from '../components/ToastContainer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SettingsPage: React.FC = () => {
  useDocumentTitle('Configuración');
  const sesion = getSesion();
  const [terminalFont, setTerminalFont] = useState(localStorage.getItem('terminal_font') || '13px');
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compact_mode') === 'true');

  const handleSave = () => {
    localStorage.setItem('terminal_font', terminalFont);
    localStorage.setItem('compact_mode', String(compactMode));
    showToast('success', 'Preferencias guardadas');
  };

  return (
    <div className="page-enter">
      <GlobalBanner />

      <div className="card">
        <div className="card-title">{'// preferencias de terminal'}</div>

        <div className="form-group">
          <label className="form-label">tamaño de fuente terminal</label>
          <select
            value={terminalFont}
            onChange={(e) => setTerminalFont(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="11px">11px</option>
            <option value="12px">12px</option>
            <option value="13px">13px (default)</option>
            <option value="14px">14px</option>
            <option value="15px">15px</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              style={{ width: 'auto', accentColor: '#f59e0b' }}
            />
            <span style={{ fontSize: '11px', color: '#a0a09a' }}>modo compacto (menos padding)</span>
          </label>
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ fontSize: '11px', padding: '6px 16px' }}>
          guardar preferencias
        </button>
      </div>

      <div className="card">
        <div className="card-title">{'// información de sesión'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#504f4a', width: '100px' }}>correo:</span>
            <span style={{ color: '#a0a09a' }}>{sesion?.correo || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#504f4a', width: '100px' }}>rol:</span>
            <span style={{ color: '#f59e0b' }}>{sesion?.rol || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#504f4a', width: '100px' }}>id:</span>
            <span style={{ color: '#a0a09a' }}>{sesion?.id || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
