import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

interface RegisterData {
  correo: string;
  clave: string;
  confirmarClave: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterData>({ correo: '', clave: '', confirmarClave: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.clave.length < 6) {
      setError('La clave debe tener al menos 6 caracteres');
      return;
    }
    if (form.clave !== form.confirmarClave) {
      setError('Las claves no coinciden');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { correo: form.correo, clave: form.clave });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
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
              {'// Crear cuenta nueva'}
            </div>
          </div>
          <div className="login-body">
            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '14px', color: 'var(--ds-green)', marginBottom: '12px' }}>
                  ✓ Cuenta creada
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', marginBottom: '16px' }}>
                  Te enviamos un correo para verificar tu cuenta.<br />
                  Luego un administrador la activará.
                </div>
                <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 20px', fontSize: '12px' }}>
                  ir a iniciar sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">correo</label>
                  <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      placeholder="usuario@correo.com"
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
                      placeholder="min. 6 caracteres"
                      required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">confirmar clave</label>
                  <input
                      type="password"
                      name="confirmarClave"
                      value={form.confirmarClave}
                      onChange={handleChange}
                      placeholder="repite la clave"
                      required
                  />
                </div>
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                  {loading ? 'registrando...' : 'crear cuenta'}
                </button>
              </form>
            )}
            {!success && (
              <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--ds-comment)', textAlign: 'center' }}>
                ¿Ya tenés cuenta? <Link to="/login" style={{ color: 'var(--ds-amber)' }}>iniciá sesión</Link>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
