import React, { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import GlobalBanner from '../components/GlobalBanner';
import SEO from '../components/SEO';

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [experiencia, setExperiencia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleSkills, setVisibleSkills] = useState<Set<number>>(new Set());
  const skillRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const fetchData = useCallback(async () => {
    try {
      const [skls, exp] = await Promise.allSettled([
        api.get<any[]>('/publico/skills'),
        api.get<any[]>('/publico/experiencia'),
      ]);
      if (skls.status === 'fulfilled') setSkills(skls.value);
      if (exp.status === 'fulfilled') setExperiencia(exp.value);
    } catch {
      setSkills([]);
      setExperiencia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (skills.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-skill-id'));
            if (id) {
              setVisibleSkills(prev => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    skillRefs.current.forEach(ref => observer.observe(ref));
    return () => observer.disconnect();
  }, [skills]);

  const categorias = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'DEVOPS', 'OTRO'] as const;
  const catLabels: Record<string, { label: string; color: string }> = {
    FRONTEND: { label: 'Frontend', color: '#61dafb' },
    BACKEND: { label: 'Backend', color: '#6db33f' },
    BASE_DATOS: { label: 'Base de Datos', color: '#4479a1' },
    DEVOPS: { label: 'DevOps', color: '#f05032' },
    OTRO: { label: 'Otros', color: '#a0a09a' },
  };

  const typeLabels: Record<string, string> = {
    TRABAJO: 'Trabajo',
    EDUCACION: 'Educación',
    CERTIFICACION: 'Certificación',
  };

  if (loading) return <LoadingBlock />;

  return (
    <>
      <SEO title="Skills" description="Habilidades técnicas, experiencia laboral y formación académica" />
      <div>
      <GlobalBanner />

      <div className="stagger-grid">
        <div className="card">
          <div className="card-title">{'// Habilidades técnicas'}</div>

          {skills.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              No hay skills registradas
            </div>
          ) : (
            categorias.map(cat => {
              const filtered = skills.filter((s: any) => s.categoria === cat);
              if (filtered.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: '18px' }}>
                  <div style={{
                    fontSize: '10px',
                    color: catLabels[cat]?.color || 'var(--ds-comment)',
                    marginBottom: '8px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderBottom: `1px solid ${catLabels[cat]?.color}22`,
                    paddingBottom: '4px',
                  }}>
                    {'// '}{catLabels[cat]?.label || cat}
                  </div>
                  {filtered.map((s: any) => (
                    <div key={s.id} className="skill-row">
                      <div className="skill-name">{s.nombre}</div>
                      <div
                        className="skill-track"
                        ref={(el) => { if (el) skillRefs.current.set(s.id, el); }}
                        data-skill-id={s.id}
                      >
                        <div
                          className="skill-fill"
                          style={{
                            width: visibleSkills.has(s.id) ? `${s.nivel}%` : '0%',
                            background: catLabels[cat]?.color || 'var(--ds-amber)',
                          }}
                        ></div>
                      </div>
                      <div className="skill-pct">{s.nivel}%</div>
                    </div>
                  ))}
                </div>
              );
            })
          )}

          <div style={{ marginTop: '16px', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
            <div className="card-title">{'// Resumen'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ds-subtle)' }}>
              Total de skills: {skills.length}
              <span style={{ margin: '0 8px' }}>·</span>
              Nivel promedio: {skills.length > 0 ? Math.round(skills.reduce((a: number, s: any) => a + s.nivel, 0) / skills.length) : 0}%
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">{'// Línea de tiempo'}</div>
          {experiencia.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              No hay experiencia registrada
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{
                position: 'absolute',
                left: '5px',
                top: '0',
                bottom: '0',
                width: '1px',
                background: 'var(--ds-border)',
              }}></div>
              {experiencia.map((e: any) => (
                <div key={e.id} style={{ position: 'relative', paddingBottom: '16px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-16px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    background: e.fechaFin ? 'var(--ds-border)' : 'var(--ds-amber)',
                    border: '2px solid var(--ds-black)',
                  }}></div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ds-amber)' }}>
                    {e.puesto}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ds-text)', marginTop: '2px' }}>
                    {e.empresa}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>
                    {new Date(e.fechaInicio).toLocaleDateString('es-CR', { year: 'numeric', month: 'short' })}
                    {' — '}
                    {e.fechaFin
                      ? new Date(e.fechaFin).toLocaleDateString('es-CR', { year: 'numeric', month: 'short' })
                      : 'Actualidad'}
                    <span style={{ margin: '0 6px' }}>·</span>
                    {typeLabels[e.tipo] || e.tipo}
                  </div>
                  {e.descripcion && (
                    <div style={{ fontSize: '11px', color: 'var(--ds-subtle)', marginTop: '4px', lineHeight: 1.5 }}>
                      {e.descripcion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default SkillsPage;
