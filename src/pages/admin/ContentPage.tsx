import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import LoadingBlock from '../../components/LoadingBlock';
import ModalDialog from '../../components/ModalDialog';

type Tab = 'proyectos' | 'posts' | 'skills' | 'experiencia' | 'tecnologias';

interface ProjectForm {
  titulo: string; descripcion: string; contenido: string;
  categoria: string; destacado: boolean;
}
interface PostForm { titulo: string; extracto: string; contenido: string; portadaUrl: string; }
interface SkillForm { nombre: string; categoria: string; nivel: number; iconKey: string; }
interface ExpForm {
  empresa: string; puesto: string; descripcion: string;
  fechaInicio: string; fechaFin: string; tipo: string; url: string;
}
interface TecForm { nombre: string; color: string; }

const defaultProject: ProjectForm = { titulo: '', descripcion: '', contenido: '', categoria: 'WEB', destacado: false };
const defaultPost: PostForm = { titulo: '', extracto: '', contenido: '', portadaUrl: '' };
const defaultSkill: SkillForm = { nombre: '', categoria: 'BACKEND', nivel: 50, iconKey: '' };
const defaultExp: ExpForm = { empresa: '', puesto: '', descripcion: '', fechaInicio: '', fechaFin: '', tipo: 'TRABAJO', url: '' };
const defaultTec: TecForm = { nombre: '', color: '#f59e0b' };

const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('proyectos');
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiencias, setExperiencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>(defaultProject);
  const [postForm, setPostForm] = useState<PostForm>(defaultPost);
  const [skillForm, setSkillForm] = useState<SkillForm>(defaultSkill);
  const [expForm, setExpForm] = useState<ExpForm>(defaultExp);
  const [tecnologias, setTecnologias] = useState<any[]>([]);
  const [tecForm, setTecForm] = useState<TecForm>(defaultTec);
  const [todaTecnologia, setTodaTecnologia] = useState<any[]>([]);
  const [tecnologiaIds, setTecnologiaIds] = useState<number[]>([]);

  useEffect(() => {
    api.get<any[]>('/publico/tecnologias').then(setTodaTecnologia).catch(() => {});
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'proyectos', label: 'Proyectos' },
    { key: 'posts', label: 'Posts' },
    { key: 'skills', label: 'Skills' },
    { key: 'experiencia', label: 'Experiencia' },
    { key: 'tecnologias', label: 'Tecnologías' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'proyectos') {
        setProyectos(await api.get<any[]>('/admin/proyectos'));
      } else if (activeTab === 'posts') {
        setPosts(await api.get<any[]>('/admin/posts'));
      } else if (activeTab === 'skills') {
        setSkills(await api.get<any[]>('/admin/skills'));
      } else if (activeTab === 'experiencia') {
        setExperiencias(await api.get<any[]>('/admin/experiencia'));
      } else if (activeTab === 'tecnologias') {
        setTecnologias(await api.get<any[]>('/admin/tecnologias'));
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setProjectForm(defaultProject);
    setPostForm(defaultPost);
    setSkillForm(defaultSkill);
    setExpForm(defaultExp);
    setTecForm(defaultTec);
    setTecnologiaIds([]);
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'proyectos') {
      setProjectForm({
        titulo: item.titulo || '', descripcion: item.descripcion || '', contenido: item.contenido || '',
        categoria: item.categoria || 'WEB',
        destacado: item.destacado || false,
      });
      setTecnologiaIds(item.tecnologias?.map((t: any) => t.id) || []);
    } else if (activeTab === 'posts') {
      setPostForm({
        titulo: item.titulo || '', extracto: item.extracto || '',
        contenido: item.contenido || '', portadaUrl: item.portadaUrl || '',
      });
    } else if (activeTab === 'skills') {
      setSkillForm({
        nombre: item.nombre || '', categoria: item.categoria || 'BACKEND',
        nivel: item.nivel ?? 50, iconKey: item.iconKey || '',
      });
    } else if (activeTab === 'experiencia') {
      setExpForm({
        empresa: item.empresa || '', puesto: item.puesto || '', descripcion: item.descripcion || '',
        fechaInicio: item.fechaInicio || '', fechaFin: item.fechaFin || '',
        tipo: item.tipo || 'TRABAJO', url: item.url || '',
      });
    } else if (activeTab === 'tecnologias') {
      setTecForm({ nombre: item.nombre || '', color: item.color || '#f59e0b' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'tecnologias') {
        const endpoint = `/admin/tecnologias`;
        if (editingId) {
          await api.put<any>(`${endpoint}/${editingId}`, tecForm);
        } else {
          await api.post<any>(endpoint, tecForm);
        }
        setModalOpen(false);
        fetchData();
        setTodaTecnologia(await api.get<any[]>('/publico/tecnologias'));
        return;
      }
      const endpoint = `/admin/${activeTab}`;
      const body = activeTab === 'proyectos' ? { ...projectForm, tecnologiaIds } : activeTab === 'posts' ? postForm : activeTab === 'skills' ? skillForm : expForm;
      if (editingId) {
        await api.put<any>(`${endpoint}/${editingId}`, body);
      } else {
        await api.post<any>(endpoint, body);
      }
      setModalOpen(false);
      fetchData();
    } catch {
      // fallback
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Eliminar este elemento?`)) return;
    try {
      if (activeTab === 'tecnologias') {
        await api.del(`/admin/tecnologias/${id}`);
      } else {
        await api.del(`/admin/${activeTab}/${id}`);
      }
      fetchData();
      if (activeTab === 'tecnologias') {
        setTodaTecnologia(await api.get<any[]>('/publico/tecnologias'));
      }
    } catch {
      // fallback
    }
  };

  const handleTogglePost = async (id: number) => {
    try {
      await api.put<any>(`/admin/posts/${id}/publicar`);
      fetchData();
    } catch {
      // fallback
    }
  };

  const handleToggleProyecto = async (id: number) => {
    try {
      await api.put<any>(`/admin/proyectos/${id}/aprobar`);
      fetchData();
    } catch {
      // fallback
    }
  };

  const handleToggleSkill = async (id: number) => {
    try {
      await api.put<any>(`/admin/skills/${id}/aprobar`);
      fetchData();
    } catch {
      // fallback
    }
  };

  const tabLabel: Record<Tab, { singular: string; article: string }> = {
    proyectos: { singular: 'proyecto', article: 'nuevo' },
    posts: { singular: 'post', article: 'nuevo' },
    skills: { singular: 'skill', article: 'nueva' },
    experiencia: { singular: 'experiencia', article: 'nueva' },
    tecnologias: { singular: 'tecnología', article: 'nueva' },
  };

  const modalTitle = editingId
    ? `Editar ${tabLabel[activeTab].singular}`
    : `${tabLabel[activeTab].article.charAt(0).toUpperCase() + tabLabel[activeTab].article.slice(1)} ${tabLabel[activeTab].singular}`;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">Contenido</div>
        <div className="page-sub">{'// Administrar contenido del portafolio'}</div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab(tab.key)}
            style={{ fontSize: '10px', padding: '4px 10px', textTransform: 'capitalize' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingBlock />
      ) : (
        <>
          <button className="btn-primary" onClick={openCreate}
            style={{ fontSize: '10px', padding: '4px 10px', marginBottom: '12px' }}>
            + {tabLabel[activeTab].article} {tabLabel[activeTab].singular}
          </button>

          {activeTab === 'proyectos' && proyectos.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No hay proyectos aún.</div>
          )}
          {activeTab === 'proyectos' && proyectos.map((p: any) => (
            <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ds-amber)' }}>{p.titulo}</div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>
                  {p.slug} · {p.categoria} · <span style={{ color: p.activo ? 'var(--ds-amber)' : 'var(--ds-comment)' }}>{p.activo ? 'activo' : 'pendiente'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => handleToggleProyecto(p.id)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {p.activo ? 'desactivar' : 'aprobar'}
                </button>
                <button className="btn-secondary" onClick={() => openEdit(p)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(p.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}

          {activeTab === 'posts' && posts.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No hay posts aún.</div>
          )}
          {activeTab === 'posts' && posts.map((post: any) => (
            <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ds-amber)' }}>{post.titulo}</div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>
                  <span style={{ color: post.estado === 'PUBLICADO' ? 'var(--ds-amber)' : 'var(--ds-comment)' }}>{post.estado}</span> · {post.vistas} vistas · {post.tiempoLectura} min
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => handleTogglePost(post.id)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {post.estado === 'PUBLICADO' ? 'ocultar' : 'aprobar'}
                </button>
                <button className="btn-secondary" onClick={() => openEdit(post)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(post.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}

          {activeTab === 'skills' && skills.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No hay skills aún.</div>
          )}
          {activeTab === 'skills' && skills.map((s: any) => (
            <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>{s.nombre}</span>
                <span style={{ fontSize: '10px', color: 'var(--ds-comment)', marginLeft: '8px' }}>
                  {s.categoria} · {s.nivel}% · <span style={{ color: s.activo ? 'var(--ds-amber)' : 'var(--ds-comment)' }}>{s.activo ? 'activo' : 'pendiente'}</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => handleToggleSkill(s.id)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>
                  {s.activo ? 'desactivar' : 'aprobar'}
                </button>
                <button className="btn-secondary" onClick={() => openEdit(s)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(s.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}

          {activeTab === 'experiencia' && experiencias.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No hay experiencia aún.</div>
          )}
          {activeTab === 'experiencia' && experiencias.map((e: any) => (
            <div key={e.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ds-amber)' }}>{e.puesto}</div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>
                  {e.empresa} · {e.tipo} · {e.fechaInicio} - {e.fechaFin || 'actual'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => openEdit(e)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(e.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}

          {activeTab === 'tecnologias' && tecnologias.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No hay tecnologías aún.</div>
          )}
          {activeTab === 'tecnologias' && tecnologias.map((t: any) => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: t.color || '#f59e0b', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>{t.nombre}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => openEdit(t)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(t.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}
        </>
      )}

      <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} width="520px">
        {activeTab === 'proyectos' && (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">título</label>
              <input value={projectForm.titulo} onChange={e => setProjectForm({ ...projectForm, titulo: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">descripción</label>
              <textarea value={projectForm.descripcion} onChange={e => setProjectForm({ ...projectForm, descripcion: e.target.value })} rows={3} required />
            </div>
            <div className="form-group">
              <label className="form-label">contenido (markdown)</label>
              <textarea value={projectForm.contenido} onChange={e => setProjectForm({ ...projectForm, contenido: e.target.value })} rows={5} required />
            </div>
            <div className="form-group">
              <label className="form-label">categoría</label>
              <select value={projectForm.categoria} onChange={e => setProjectForm({ ...projectForm, categoria: e.target.value })}>
                <option value="WEB">Web</option>
                <option value="MOBILE">Mobile</option>
                <option value="CLI">CLI</option>
                <option value="API">API</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={projectForm.destacado} onChange={e => setProjectForm({ ...projectForm, destacado: e.target.checked })} style={{ accentColor: 'var(--ds-amber)', margin: '0', width: '12px', height: '12px' }} />
              <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>Destacado</span>
            </div>
            <div className="form-group">
              <label className="form-label">tecnologías</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {todaTecnologia.map((t: any) => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer', padding: '2px 0' }}>
                    <input type="checkbox" checked={tecnologiaIds.includes(t.id)}
                      onChange={() => setTecnologiaIds(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id])}
                      style={{ accentColor: 'var(--ds-amber)', margin: '0', width: '12px', height: '12px' }} />
                    {t.nombre}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear proyecto'}
            </button>
          </form>
        )}

        {activeTab === 'posts' && (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">título</label>
              <input value={postForm.titulo} onChange={e => setPostForm({ ...postForm, titulo: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">extracto</label>
              <textarea value={postForm.extracto} onChange={e => setPostForm({ ...postForm, extracto: e.target.value })} rows={2} required />
            </div>
            <div className="form-group">
              <label className="form-label">contenido (markdown)</label>
              <textarea value={postForm.contenido} onChange={e => setPostForm({ ...postForm, contenido: e.target.value })} rows={5} required />
            </div>
            <div className="form-group">
              <label className="form-label">URL de portada</label>
              <input value={postForm.portadaUrl} onChange={e => setPostForm({ ...postForm, portadaUrl: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear post'}
            </button>
          </form>
        )}

        {activeTab === 'skills' && (
          <form onSubmit={handleSave}>
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
            <div className="form-group">
              <label className="form-label">iconKey (opcional)</label>
              <input value={skillForm.iconKey} onChange={e => setSkillForm({ ...skillForm, iconKey: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear skill'}
            </button>
          </form>
        )}

        {activeTab === 'experiencia' && (
          <form onSubmit={handleSave}>
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
              <label className="form-label">fecha fin (vacío = actual)</label>
              <input type="date" value={expForm.fechaFin} onChange={e => setExpForm({ ...expForm, fechaFin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">descripción</label>
              <textarea value={expForm.descripcion} onChange={e => setExpForm({ ...expForm, descripcion: e.target.value })} rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">URL (opcional)</label>
              <input value={expForm.url} onChange={e => setExpForm({ ...expForm, url: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear experiencia'}
            </button>
          </form>
        )}

        {activeTab === 'tecnologias' && (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">nombre</label>
              <input value={tecForm.nombre} onChange={e => setTecForm({ ...tecForm, nombre: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={tecForm.color} onChange={e => setTecForm({ ...tecForm, color: e.target.value })}
                  style={{ width: '40px', height: '30px', padding: '2px', cursor: 'pointer' }} />
                <span style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>{tecForm.color}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear tecnología'}
            </button>
          </form>
        )}
      </ModalDialog>
    </div>
  );
};

export default ContentPage;
