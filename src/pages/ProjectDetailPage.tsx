import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import SEO from '../components/SEO';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const data = await api.get<any>(`/publico/proyectos/${slug}`);
        setProyecto(data);
      } catch {
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [slug, navigate]);

  if (loading) return <LoadingBlock />;
  if (!proyecto) return null;

  return (
    <>
      <SEO title={proyecto.titulo} description={proyecto.descripcion} />
      <div>
      <button className="btn-secondary" onClick={() => navigate('/projects')} style={{ marginBottom: '16px', fontSize: '11px', padding: '4px 12px' }}>
        ← volver
      </button>

      <div className="page-header">
        <div className="page-title">{proyecto.titulo}</div>
        <div className="page-sub">{'// '}{proyecto.categoria} · {proyecto.slug}</div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {proyecto.descripcion}
        </div>
      </div>

      {proyecto.contenido && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-title">{'// Contenido'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {proyecto.contenido}
          </div>
        </div>
      )}


      <div className="card">
        <div className="card-title">{'// Tecnologías'}</div>
        <div>
          {proyecto.tecnologias?.map((t: any) => (
            <span key={t.id} className="tag" style={{ fontSize: '11px', padding: '3px 10px' }}>{t.nombre}</span>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectDetailPage;
