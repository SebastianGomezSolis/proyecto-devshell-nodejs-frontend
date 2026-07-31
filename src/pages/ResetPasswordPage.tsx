import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../utils/api';

const ResetPasswordPage: React.FC = () => {
  useDocumentTitle('Restablecer contraseña');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (clave.length < 6) {
      setError('La clave debe tener al menos 6 caracteres');
      return;
    }
    if (clave !== confirmarClave) {
      setError('Las claves no coinciden');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/restablecer-clave', { token, clave });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo restablecer la contraseña';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-enter" style={{ position: 'relative' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px 16px', fontSize: '11px', zIndex: 200 }}>
        volver
      </button>
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">dev<span>/</span>shell<span>_</span></div>
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)', marginTop: '6px' }}>
            {'// nueva contraseña'}
          </div>
        </div>
        <div className="login-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ color: 'var(--ds-green)', fontSize: '12px', marginBottom: '8px' }}>
                ✓ Contraseña actualizada
              </div>
              <div style={{ color: 'var(--ds-subtle)', fontSize: '11px', lineHeight: 1.5, marginBottom: '16px' }}>
                Ya puedes iniciar sesión con tu nueva contraseña.
              </div>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: '11px', padding: '6px 16px' }}>
                ir a iniciar sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">nueva clave</label>
                <input
                  type="password"
                  value={clave}
                  onChange={(e) => { setClave(e.target.value); setError(''); }}
                  placeholder="min. 6 caracteres"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">confirmar clave</label>
                <input
                  type="password"
                  value={confirmarClave}
                  onChange={(e) => { setConfirmarClave(e.target.value); setError(''); }}
                  placeholder="repite la clave"
                  required
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                {loading ? 'guardando...' : 'actualizar contraseña'}
              </button>
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <Link to="/login" style={{ color: 'var(--ds-amber)', fontSize: '11px' }}>← volver al login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
