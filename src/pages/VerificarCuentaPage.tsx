import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../utils/api';

const VerificarCuentaPage: React.FC = () => {
  useDocumentTitle('Verificar correo');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .post<{ message: string }>('/auth/verificar-cuenta', { token })
      .then(() => { if (active) setStatus('success'); })
      .catch((err: unknown) => {
        if (!active) return;
        setStatus('error');
        setError(err instanceof Error ? err.message : 'No se pudo verificar el correo');
      });
    return () => { active = false; };
  }, [token]);

  return (
    <div className="login-page page-enter" style={{ position: 'relative' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px 16px', fontSize: '11px', zIndex: 200 }}>
        volver
      </button>
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">dev<span>/</span>shell<span>_</span></div>
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)', marginTop: '6px' }}>
            {'// verificación de correo'}
          </div>
        </div>
        <div className="login-body" style={{ textAlign: 'center', padding: '24px 0' }}>
          {status === 'verifying' && (
            <div style={{ color: 'var(--ds-subtle)', fontSize: '12px' }}>verificando...</div>
          )}
          {status === 'success' && (
            <>
              <div style={{ color: 'var(--ds-green)', fontSize: '14px', marginBottom: '12px' }}>
                ✓ Correo verificado
              </div>
              <div style={{ color: 'var(--ds-subtle)', fontSize: '12px', lineHeight: 1.5, marginBottom: '16px' }}>
                Tu cuenta está verificada y lista para usar.
              </div>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 20px', fontSize: '12px' }}>
                ir a iniciar sesión
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ color: 'var(--ds-red)', fontSize: '14px', marginBottom: '12px' }}>
                ✗ No se pudo verificar
              </div>
              <div style={{ color: 'var(--ds-subtle)', fontSize: '12px', lineHeight: 1.5, marginBottom: '16px' }}>
                {error}
              </div>
              <Link to="/login" style={{ color: 'var(--ds-amber)', fontSize: '12px' }}>volver al login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificarCuentaPage;
