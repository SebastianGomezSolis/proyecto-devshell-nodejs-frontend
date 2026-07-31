import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { validarEmail } from '../utils/validators';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = validarEmail(correo);
    if (!emailCheck.valido) {
      setError(emailCheck.error || '');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      await api.post('/auth/recuperar-clave', { correo });
    } catch {
      // swallow — la respuesta es genérica para no revelar si la cuenta existe
    }
    setStatus('sent');
  };

  return (
    <div className="login-page page-enter">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">dev<span>/</span>shell<span>_</span></div>
          <div style={{ fontSize: '11px', color: '#504f4a', marginTop: '6px' }}>
            {'// recuperar acceso'}
          </div>
        </div>
        <div className="login-body">
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ color: '#22c55e', fontSize: '12px', marginBottom: '8px' }}>
                ✓ Correo enviado
              </div>
              <div style={{ color: '#a0a09a', fontSize: '11px', lineHeight: 1.5, marginBottom: '16px' }}>
                Si la cuenta existe, recibirás instrucciones en tu correo.
              </div>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ fontSize: '11px', padding: '6px 16px' }}>
                volver al login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">correo electrónico</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', marginTop: '8px' }}>
                {status === 'sending' ? 'enviando...' : 'recuperar contraseña'}
              </button>
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <button type="button" className="btn-secondary" onClick={() => navigate('/login')} style={{ fontSize: '10px', padding: '4px 12px' }}>
                  ← volver al login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
