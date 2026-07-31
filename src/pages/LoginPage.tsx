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
              <input
                type="password"
                name="clave"
                value={form.clave}
                onChange={handleChange}
                placeholder=""
                required
              />
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
