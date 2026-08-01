import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import LoadingBlock from '../../components/LoadingBlock';

const CVPage: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillForm, setSkillForm] = useState({ nombre: '', categoria: 'BACKEND', nivel: 50 });
  const [expForm, setExpForm] = useState({
    empresa: '', puesto: '', descripcion: '', fechaInicio: '', fechaFin: '', tipo: 'TRABAJO', url: ''
  });
  const [message, setMessage] = useState('');
  const [descargando, setDescargando] = useState(false);
  const [msgPdf, setMsgPdf] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const fetchData = async () => {
    try {
      const skls = await api.get<any[]>('/publico/skills');
      setSkills(skls);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post<any>('/admin/skills', skillForm);
      setMessage('Skill agregada');
      setSkillForm({ nombre: '', categoria: 'BACKEND', nivel: 50 });
      fetchData();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('¿Eliminar skill?')) return;
    try {
      await api.del(`/admin/skills/${id}`);
      fetchData();
    } catch {
      // fallback
    }
  };

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post<any>('/admin/experiencia', expForm);
      setMessage('Experiencia agregada');
      setExpForm({ empresa: '', puesto: '', descripcion: '', fechaInicio: '', fechaFin: '', tipo: 'TRABAJO', url: '' });
      fetchData();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleDescargarPdf = async () => {
    setDescargando(true);
    setMsgPdf(null);
    const win = window.open('', '_blank');
    try {
      const blob = await api.blob('/admin/cv/pdf');
      const url = URL.createObjectURL(blob);
      if (win) {
        win.location.href = url;
      } else {
        window.open(url, '_blank');
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setMsgPdf({ tipo: 'ok', texto: 'CV abierto en una nueva pestaña. Desde el visor puedes descargarlo.' });
    } catch (err: unknown) {
      if (win) win.close();
      setMsgPdf({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error al generar el CV' });
    } finally {
      setDescargando(false);
    }
  };

  if (loading) return <LoadingBlock />;

  return (
    <div className="page-enter">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <div className="page-title">CV</div>
          <div className="page-sub">{'// Administrar CV'}</div>
        </div>
        <button
          className="btn-primary"
          onClick={handleDescargarPdf}
          disabled={descargando}
          style={{ fontSize: '11px', padding: '6px 14px' }}
        >
          {descargando ? 'generando...' : '⬇ descargar CV en PDF'}
        </button>
      </div>

      {msgPdf && (
        <div style={{ color: msgPdf.tipo === 'ok' ? 'var(--ds-green)' : 'var(--ds-red)', fontSize: '11px', marginBottom: '10px' }}>{msgPdf.texto}</div>
      )}

      {message && (
        <div style={{ color: 'var(--ds-green)', fontSize: '11px', marginBottom: '10px' }}>{message}</div>
      )}

      <div className="stagger-grid">
        <div className="card">
          <div className="card-title">{'// Agregar skill'}</div>
          <form onSubmit={handleAddSkill}>
            <div className="form-group">
              <label className="form-label">nombre</label>
              <input value={skillForm.nombre} onChange={e => setSkillForm({ ...skillForm, nombre: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">categoría</label>
              <select value={skillForm.categoria} onChange={e => setSkillForm({ ...skillForm, categoria: e.target.value })}>
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
                <option value="BASE_DATOS">Base de Datos</option>
                <option value="DEVOPS">DevOps</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">nivel (0-100): {skillForm.nivel}%</label>
              <input type="range" min="0" max="100" value={skillForm.nivel}
                onChange={e => setSkillForm({ ...skillForm, nivel: Number(e.target.value) })}
                style={{ accentColor: 'var(--ds-amber)' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>agregar skill</button>
          </form>

          <div style={{ marginTop: '16px' }}>
            <div className="card-title" style={{ marginBottom: '8px' }}>{'// Skills actuales'}</div>
            {skills.map((s: any) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1a1a1a' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>{s.nombre}</span>
                  <span style={{ fontSize: '10px', color: 'var(--ds-comment)', marginLeft: '8px' }}>{s.categoria} · {s.nivel}%</span>
                </div>
                <button onClick={() => handleDeleteSkill(s.id)} style={{ background: 'none', border: 'none', color: 'var(--ds-red)', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '10px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">{'// Agregar experiencia'}</div>
          <form onSubmit={handleAddExp}>
            <div className="form-group">
              <label className="form-label">empresa / institución</label>
              <input value={expForm.empresa} onChange={e => setExpForm({ ...expForm, empresa: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">puesto / título</label>
              <input value={expForm.puesto} onChange={e => setExpForm({ ...expForm, puesto: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">tipo</label>
              <select value={expForm.tipo} onChange={e => setExpForm({ ...expForm, tipo: e.target.value })}>
                <option value="TRABAJO">Trabajo</option>
                <option value="EDUCACION">Educación</option>
                <option value="CERTIFICACION">Certificación</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">fecha inicio</label>
              <input type="date" value={expForm.fechaInicio} onChange={e => setExpForm({ ...expForm, fechaInicio: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">fecha fin (dejar vacío si es actual)</label>
              <input type="date" value={expForm.fechaFin} onChange={e => setExpForm({ ...expForm, fechaFin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">descripción</label>
              <textarea value={expForm.descripcion} onChange={e => setExpForm({ ...expForm, descripcion: e.target.value })} rows={3} />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>agregar experiencia</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVPage;
