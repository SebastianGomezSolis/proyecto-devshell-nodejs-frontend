import React from 'react';
import { getSesion } from '../utils/auth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  useDocumentTitle('Perfil');
  const navigate = useNavigate();
  const sesion = getSesion();

  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event('token-changed'));
    navigate('/');
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">perfil</div>
        <div className="page-sub">{'// Información del desarrollador'}</div>
      </div>

      <div className="card">
        <div className="card-title">{'// Datos de cuenta'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#504f4a', width: '120px' }}>correo:</span>
            <span style={{ color: '#f5f5f0' }}>{sesion?.correo || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#504f4a', width: '120px' }}>rol:</span>
            <span style={{ color: '#f59e0b' }}>{sesion?.rol || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#504f4a', width: '120px' }}>id de usuario:</span>
            <span style={{ color: '#a0a09a' }}>#{sesion?.id || '—'}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{'// Acciones'}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => navigate('/settings')} style={{ fontSize: '11px', padding: '6px 16px' }}>
            configuración
          </button>
          <button className="btn-secondary" onClick={handleLogout} style={{ fontSize: '11px', padding: '6px 16px', color: '#ef4444' }}>
            cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
