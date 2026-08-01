import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalBanner from '../components/GlobalBanner';
import LoadingBlock from '../components/LoadingBlock';
import SEO from '../components/SEO';
import { api } from '../utils/api';
import { API_BASE } from '../utils/constants';
import { formatFecha } from '../utils/formatters';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>('/publico/perfil')
      .then(setPerfil)
      .catch(() => setPerfil(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingBlock />;

  const skills = perfil?.skills || [];
  const experiencia = perfil?.experiencia || [];
  const proyectos = perfil?.proyectos || [];
  const nombre = perfil?.nombre || 'Sebastián Gómez';

  return (
    <div className="page-enter">
      <SEO title="Acerca de" description={`CV y perfil de ${nombre}`} />
      <GlobalBanner />

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <div className="card-title">{'// Curriculum Vitae'}</div>
          <div style={{ fontSize: '18px', color: 'var(--ds-amber)', fontWeight: 500 }}>{nombre}</div>
          <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', marginTop: '4px' }}>
            {perfil?.titulo || 'Full-Stack Developer'}
          </div>
          {perfil?.localizacion && (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)', marginTop: '2px' }}>
              📍 {perfil.localizacion}
            </div>
          )}
          <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="tag" style={{ color: perfil?.disponible === false ? 'var(--ds-red)' : 'var(--ds-green)' }}>
              {perfil?.disponible === false ? 'no disponible' : 'disponible para proyectos'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <a
            className="btn-primary"
            href={`${API_BASE}/publico/cv/descargar`}
            style={{ fontSize: '11px', padding: '6px 16px', textDecoration: 'none' }}
          >
            ⬇ descargar CV
          </a>
          <div style={{ display: 'flex', gap: '8px' }}>
            {perfil?.githubUrl && (
              <a className="btn-secondary" href={perfil.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', padding: '4px 10px', textDecoration: 'none' }}>
                github
              </a>
            )}
            {perfil?.linkedinUrl && (
              <a className="btn-secondary" href={perfil.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', padding: '4px 10px', textDecoration: 'none' }}>
                linkedin
              </a>
            )}
          </div>
        </div>
      </div>

      {perfil?.bio && (
        <div className="card">
          <div className="card-title">{'// Sobre mí'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', lineHeight: 1.8 }}>{perfil.bio}</div>
        </div>
      )}

      <div className="card">
        <div className="card-title">{'// Habilidades técnicas'}</div>
        {skills.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>Sin habilidades registradas.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
            {skills.map((s: any) => (
              <div key={s.id} className="skill-row">
                <div className="skill-name">{s.nombre}</div>
                <div className="skill-track">
                  <div className="skill-fill" style={{ width: `${s.nivel}%` }}></div>
                </div>
                <div className="skill-pct">{s.nivel}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">{'// Experiencia y educación'}</div>
        {experiencia.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>Sin experiencia registrada.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experiencia.map((e: any) => (
              <div key={e.id} style={{ borderBottom: '1px solid var(--ds-muted)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--ds-amber)', fontWeight: 500 }}>{e.puesto}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}> @ {e.empresa}</span>
                  </div>
                  <span className="tag" style={{ fontSize: '9px' }}>{e.tipo}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '4px' }}>
                  {formatFecha(e.fechaInicio)} — {e.fechaFin ? formatFecha(e.fechaFin) : 'presente'}
                </div>
                {e.descripcion && (
                  <div style={{ fontSize: '11px', color: 'var(--ds-subtle)', marginTop: '4px', lineHeight: 1.6 }}>{e.descripcion}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">{'// Proyectos'}</div>
        {proyectos.length === 0 ? (
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>Sin proyectos activos.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {proyectos.map((p: any) => (
              <div
                key={p.id}
                className="project-item"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/projects/${p.slug}`)}
              >
                <div className="project-dot"></div>
                <div style={{ flex: 1 }}>
                  <div className="project-name">{p.titulo}</div>
                  <div className="project-tech">
                    {p.categoria}
                    {p.tecnologias?.length > 0 && ` · ${p.tecnologias.map((t: any) => t.nombre).join(', ')}`}
                  </div>
                </div>
                {p.destacado && <span style={{ fontSize: '9px', color: 'var(--ds-amber)' }}>★</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
