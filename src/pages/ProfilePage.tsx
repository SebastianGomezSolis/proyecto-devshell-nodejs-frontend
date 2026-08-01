import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSesion, logout } from '../utils/auth';
import GlobalBanner from '../components/GlobalBanner';
import LoadingBlock from '../components/LoadingBlock';
import SEO from '../components/SEO';
import { api } from '../utils/api';
import { formatFecha } from '../utils/formatters';

interface HistorialItem {
  correo: string;
  ipOrigen: string;
  exitoso: boolean;
  creadoEn: string;
}

const ProfilePage: React.FC = () => {
  const sesion = getSesion();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '', apellidos: '', bio: '', localizacion: '', githubUrl: '', linkedinUrl: '', disponible: true,
  });
  const [clave, setClave] = useState({ claveActual: '', claveNueva: '', confirmar: '' });
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [msgClave, setMsgClave] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const fetchPerfil = async () => {
    try {
      const data = await api.get<any>('/perfil');
      setPerfil(data);
      if (data.administrador) {
        setForm({
          nombre: data.administrador.nombre || '',
          apellidos: data.administrador.apellidos || '',
          bio: data.administrador.bio || '',
          localizacion: data.administrador.localizacion || '',
          githubUrl: data.administrador.githubUrl || '',
          linkedinUrl: data.administrador.linkedinUrl || '',
          disponible: data.administrador.disponible !== false,
        });
      }
    } catch (err: unknown) {
      setMsg({ tipo: 'error', texto: err instanceof Error ? err.message : 'No se pudo cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMsg(null);
    try {
      await api.put<any>('/perfil', form);
      setMsg({ tipo: 'ok', texto: 'Perfil actualizado correctamente.' });
      await fetchPerfil();
    } catch (err: unknown) {
      setMsg({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error al guardar el perfil' });
    } finally {
      setGuardando(false);
    }
  };

  const handleChangeClave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgClave(null);
    if (clave.claveNueva !== clave.confirmar) {
      setMsgClave({ tipo: 'error', texto: 'Las claves nuevas no coinciden.' });
      return;
    }
    try {
      const res = await api.put<{ message: string }>('/perfil/clave', {
        claveActual: clave.claveActual,
        claveNueva: clave.claveNueva,
      });
      setMsgClave({ tipo: 'ok', texto: res.message || 'Clave actualizada.' });
      setClave({ claveActual: '', claveNueva: '', confirmar: '' });
      logout();
      navigate('/login');
    } catch (err: unknown) {
      setMsgClave({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error al cambiar la clave' });
    }
  };

  if (loading) return <LoadingBlock />;

  const historial: HistorialItem[] = perfil?.historial || [];

  return (
    <div className="page-enter">
      <SEO title="Perfil" description="Perfil de cuenta e historial de inicio de sesión" />
      <GlobalBanner />

      <div className="card">
        <div className="card-title">{'// Datos de cuenta'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--ds-comment)', width: '120px' }}>correo:</span>
            <span style={{ color: 'var(--ds-subtle)' }}>{perfil?.correo || sesion?.correo || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--ds-comment)', width: '120px' }}>rol:</span>
            <span style={{ color: 'var(--ds-amber)' }}>{perfil?.rol || sesion?.rol || '—'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--ds-comment)', width: '120px' }}>id de usuario:</span>
            <span style={{ color: 'var(--ds-subtle)' }}>#{perfil?.id || sesion?.id || '—'}</span>
          </div>
          {perfil?.creadoEn && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--ds-comment)', width: '120px' }}>registrado:</span>
              <span style={{ color: 'var(--ds-subtle)' }}>{formatFecha(perfil.creadoEn)}</span>
            </div>
          )}
        </div>
      </div>

      {perfil?.administrador && (
        <form className="card" onSubmit={handleSave}>
          <div className="card-title">{'// Editar información pública'}</div>
          {msg && (
            <div style={{ fontSize: '11px', marginBottom: '10px', color: msg.tipo === 'ok' ? 'var(--ds-green)' : 'var(--ds-red)' }}>
              {msg.texto}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group">
              <label className="form-label">nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">apellidos</label>
              <input value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">localización</label>
              <input value={form.localizacion} onChange={e => setForm({ ...form, localizacion: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
              <input
                type="checkbox"
                checked={form.disponible}
                onChange={e => setForm({ ...form, disponible: e.target.checked })}
                style={{ accentColor: 'var(--ds-amber)', margin: '0', width: '13px', height: '13px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>disponible para proyectos</span>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">biografía</label>
              <textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={guardando} style={{ fontSize: '11px', padding: '6px 16px' }}>
            {guardando ? 'guardando...' : 'guardar cambios'}
          </button>
        </form>
      )}

      <div className="card">
        <div className="card-title">{'// Cambiar contraseña'}</div>
        {msgClave && (
          <div style={{ fontSize: '11px', marginBottom: '10px', color: msgClave.tipo === 'ok' ? 'var(--ds-green)' : 'var(--ds-red)' }}>
            {msgClave.texto}
          </div>
        )}
        <form onSubmit={handleChangeClave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0 16px', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">clave actual</label>
            <input type="password" value={clave.claveActual} onChange={e => setClave({ ...clave, claveActual: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">clave nueva</label>
            <input type="password" value={clave.claveNueva} onChange={e => setClave({ ...clave, claveNueva: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">confirmar clave</label>
            <input type="password" value={clave.confirmar} onChange={e => setClave({ ...clave, confirmar: e.target.value })} required minLength={6} />
          </div>
          <div className="form-group">
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 16px' }}>
              cambiar clave
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-title">{'// Historial de inicios de sesión'}</div>
        {historial.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)', padding: '8px 0' }}>
            Aún no hay intentos de inicio de sesión registrados.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {historial.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '11px', borderBottom: '1px solid var(--ds-muted)', paddingBottom: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.exitoso ? 'var(--ds-green)' : 'var(--ds-red)', display: 'inline-block' }}></span>
                  <span style={{ color: item.exitoso ? 'var(--ds-subtle)' : 'var(--ds-red)' }}>
                    {item.exitoso ? 'exitoso' : 'fallido'}
                  </span>
                </div>
                <div style={{ color: 'var(--ds-subtle)' }}>{item.ipOrigen || '—'}</div>
                <div style={{ color: 'var(--ds-comment)' }}>{formatFecha(item.creadoEn)} {new Date(item.creadoEn).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
