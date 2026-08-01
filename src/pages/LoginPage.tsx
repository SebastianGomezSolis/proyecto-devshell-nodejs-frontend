import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { api } from '../utils/api';

interface LoginData {
  correo: string;
  clave: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState<LoginData>({
    correo: localStorage.getItem('devshell.correo') ?? '',
    clave: localStorage.getItem('devshell.clave') ?? '',
  });
  const [recordar, setRecordar] = useState(() => localStorage.getItem('devshell.recordar') === 'true');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post<{ id: number; correo: string; rol: string; referenciaId: number; token: string }>(
        '/auth/login',
        form
      );
      if (recordar) {
        localStorage.setItem('devshell.recordar', 'true');
        localStorage.setItem('devshell.correo', form.correo);
        localStorage.setItem('devshell.clave', form.clave);
      } else {
        localStorage.removeItem('devshell.recordar');
        localStorage.removeItem('devshell.correo');
        localStorage.removeItem('devshell.clave');
      }
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('token-changed'));
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-enter" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px', zIndex: 200 }}>
        <button
          className="btn-secondary"
          onClick={toggleTheme}
          style={{ padding: '4px 8px', fontSize: '11px', minWidth: '32px' }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '6px 16px', fontSize: '11px' }}>
          volver
        </button>
      </div>
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">dev<span>/</span>shell<span>_</span></div>
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)', marginTop: '6px' }}>
            {'// Autenticación requerida'}
          </div>
        </div>
        <div className="login-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">correo</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">clave</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  name="clave"
                  value={form.clave}
                  onChange={handleChange}
                  placeholder=""
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarClave((v) => !v)}
                  title={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'}
                  aria-label={mostrarClave ? 'Ocultar clave' : 'Mostrar clave'}
                  style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--ds-comment)', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
                >
                  {mostrarClave ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <label htmlFor="recordar" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', fontSize: '11px', color: 'var(--ds-comment)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="recordar"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                style={{ accentColor: 'var(--ds-amber)', margin: '0', width: '12px', height: '12px' }}
              />
              Recordar credenciales
            </label>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'autenticando...' : 'ingresar'}
            </button>
          </form>
          <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--ds-comment)', textAlign: 'center' }}>
            ¿No tenés cuenta? <Link to="/register" style={{ color: 'var(--ds-amber)' }}>registrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
