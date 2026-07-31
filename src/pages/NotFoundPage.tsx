import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
    }}>
      <div style={{ fontSize: '48px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
        404
      </div>
      <div style={{ fontSize: '12px', color: '#504f4a', marginBottom: '4px' }}>
        {'// page not found'}
      </div>
      <div style={{ fontSize: '12px', color: '#a0a09a', marginBottom: '24px' }}>
        La ruta solicitada no existe en el sistema de archivos
      </div>
      <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ fontSize: '11px', padding: '8px 20px' }}>
        volver al dashboard →
      </button>
    </div>
  );
};

export default NotFoundPage;
