import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import GlobalBanner from '../components/GlobalBanner';
import SEO from '../components/SEO';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [tecnologias, setTecnologias] = useState<any[]>([]);
  const [filtroTecnologia, setFiltroTecnologia] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [loading, setLoading] = useState(true);

  const categorias = ['WEB', 'MOBILE', 'CLI', 'API', 'OTHER'];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projs, tecs] = await Promise.all([
        api.get<any[]>('/publico/proyectos'),
        api.get<any[]>('/publico/tecnologias'),
      ]);
      setProyectos(projs);
      setTecnologias(tecs);
    } catch {
      setProyectos([]);
      setTecnologias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = proyectos.filter((p: any) => {
    if (filtroTecnologia && !p.tecnologias?.some((t: any) => t.nombre === filtroTecnologia)) return false;
    if (filtroCategoria && p.categoria !== filtroCategoria) return false;
    return true;
  });

  if (loading) return <LoadingBlock />;

  return (
    <>
      <SEO title="Proyectos" description="Portafolio de proyectos de desarrollo web, móvil, CLI, API y más" />
      <div className="page-enter">
      <GlobalBanner />

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>filtrar por tecnología:</span>
          <button
            className={filtroTecnologia === '' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFiltroTecnologia('')}
            style={{ fontSize: '10px', padding: '3px 10px' }}
          >
            todas
          </button>
          {tecnologias.map((t: any) => (
            <button
              key={t.id}
              className={filtroTecnologia === t.nombre ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setFiltroTecnologia(t.nombre)}
              style={{ fontSize: '10px', padding: '3px 10px' }}
            >
              {t.nombre}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>filtrar por categoría:</span>
          <button
            className={filtroCategoria === '' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFiltroCategoria('')}
            style={{ fontSize: '10px', padding: '3px 10px' }}
          >
            todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              className={filtroCategoria === cat ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setFiltroCategoria(cat)}
              style={{ fontSize: '10px', padding: '3px 10px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>∅</div>
          <div>No se encontraron proyectos</div>
          <div style={{ fontSize: '10px', marginTop: '4px', color: 'var(--ds-border)' }}>
            {filtroTecnologia || filtroCategoria ? 'Intenta con otros filtros' : 'No hay proyectos registrados aún'}
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginBottom: '10px' }}>
            {filtered.length} proyecto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="stagger-grid">
            {filtered.map((p: any) => (
              <div
                key={p.id}
                className="card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/projects/${p.slug}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ds-amber)' }}>
                    {p.titulo}
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--ds-comment)', border: '1px solid var(--ds-border)', padding: '1px 6px' }}>
                    {p.categoria}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ds-subtle)', marginBottom: '10px', lineHeight: 1.6, flex: 1 }}>
                  {p.descripcion && p.descripcion.length > 120 ? `${p.descripcion.substring(0, 120)}...` : p.descripcion}
                </div>
                <div>
                  {p.tecnologias?.map((t: any) => (
                    <span key={t.id} className="tag" style={{ borderColor: t.color ? `${t.color}44` : undefined, color: t.color || undefined }}>
                      {t.nombre}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>
                    {new Date(p.creadoEn).toLocaleDateString('es-CR', { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default ProjectsPage;
