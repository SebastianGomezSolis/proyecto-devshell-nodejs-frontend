import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import ModalDialog from '../components/ModalDialog';

type Tab = 'proyectos' | 'posts';

interface ProjectForm {
  titulo: string; descripcion: string; contenido: string;
  categoria: string; destacado: boolean;
}
interface PostForm { titulo: string; extracto: string; contenido: string; portadaUrl: string; }

const defaultProject: ProjectForm = { titulo: '', descripcion: '', contenido: '', categoria: 'WEB', destacado: false };
const defaultPost: PostForm = { titulo: '', extracto: '', contenido: '', portadaUrl: '' };

const MisContenidoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('proyectos');
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>(defaultProject);
  const [postForm, setPostForm] = useState<PostForm>(defaultPost);
  const [todaTecnologia, setTodaTecnologia] = useState<any[]>([]);
  const [tecnologiaIds, setTecnologiaIds] = useState<number[]>([]);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    api.get<any[]>('/publico/tecnologias').then(setTodaTecnologia).catch(() => {});
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'proyectos', label: 'Proyectos' },
    { key: 'posts', label: 'Posts' },
  ];

  const fetchData = async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      if (activeTab === 'proyectos') {
        setProyectos(await api.get<any[]>('/mis/proyectos'));
      } else if (activeTab === 'posts') {
        setPosts(await api.get<any[]>('/mis/posts'));
      }
    } catch {
      if (activeTab === 'proyectos') setProyectos([]);
      else if (activeTab === 'posts') setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setProjectForm(defaultProject);
    setPostForm(defaultPost);
    setTecnologiaIds([]);
    setStatusMsg('');
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setStatusMsg('');
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
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    try {
      const endpoint = `/mis/${activeTab}`;
      const body = activeTab === 'proyectos' ? { ...projectForm, tecnologiaIds } : postForm;
      if (editingId) {
        await api.put<any>(`${endpoint}/${editingId}`, body);
      } else {
        await api.post<any>(endpoint, body);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      setStatusMsg(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Eliminar este elemento?`)) return;
    try {
      await api.del(`/mis/${activeTab}/${id}`);
      fetchData();
    } catch {
      // fallback
    }
  };

  const tabLabel: Record<Tab, { singular: string; article: string }> = {
    proyectos: { singular: 'proyecto', article: 'nuevo' },
    posts: { singular: 'post', article: 'nuevo' },
  };

  const modalTitle = editingId
    ? `Editar ${tabLabel[activeTab].singular}`
    : `${tabLabel[activeTab].article.charAt(0).toUpperCase() + tabLabel[activeTab].article.slice(1)} ${tabLabel[activeTab].singular}`;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">Mi Contenido</div>
        <div className="page-sub">{'// Gestiona tu propio portafolio'}</div>
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
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No tienes proyectos aún.</div>
          )}
          {activeTab === 'proyectos' && proyectos.map((p: any) => (
            <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ds-amber)' }}>{p.titulo}</div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>{p.slug} · {p.categoria}</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => openEdit(p)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(p.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}

          {activeTab === 'posts' && posts.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>No tienes posts aún.</div>
          )}
          {activeTab === 'posts' && posts.map((post: any) => (
            <div key={post.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--ds-amber)' }}>{post.titulo}</div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>
                  <span style={{ color: post.estado === 'PUBLICADO' ? 'var(--ds-green)' : 'var(--ds-amber-dim)' }}>
                    {post.estado === 'PUBLICADO' ? 'publicado' : 'pendiente de aprobación'}
                  </span>
                  · {post.vistas} vistas · {post.tiempoLectura} min
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-secondary" onClick={() => openEdit(post)}
                  style={{ fontSize: '9px', padding: '2px 6px' }}>editar</button>
                <button className="btn-secondary" onClick={() => handleDelete(post.id)}
                  style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)' }}>eliminar</button>
              </div>
            </div>
          ))}
        </>
      )}

      <ModalDialog open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} width="520px">
        {statusMsg && (
          <div style={{ color: 'var(--ds-red)', fontSize: '11px', marginBottom: '10px' }}>{statusMsg}</div>
        )}

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
            <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginBottom: '12px' }}>
              Los posts requieren aprobación del administrador antes de publicarse.
            </div>
            <button type="submit" className="btn-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {editingId ? 'guardar cambios' : 'crear post'}
            </button>
          </form>
        )}
      </ModalDialog>
    </div>
  );
};

export default MisContenidoPage;
