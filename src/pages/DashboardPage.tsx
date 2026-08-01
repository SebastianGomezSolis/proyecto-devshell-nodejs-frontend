import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { getSesion } from '../utils/auth';
import LoadingBlock from '../components/LoadingBlock';
import GlobalBanner from '../components/GlobalBanner';
import SEO from '../components/SEO';
import { COLORES } from '../utils/constants';

interface DashboardData {
  proyectos: number;
  posts: number;
  skills: number;
  mensajes: number;
}

interface DiaActividad {
  fecha: string;
  logins: number;
  registros: number;
  visitas: number;
}

const METRICAS: Record<string, { label: string; color: string }> = {
  logins: { label: 'inicios de sesión', color: COLORES.AMBER },
  visitas: { label: 'comandos en terminal', color: COLORES.BLUE },
  registros: { label: 'cuentas nuevas', color: COLORES.GREEN },
};

const MetricChart: React.FC<{ data: DiaActividad[]; metric: string }> = ({ data, metric }) => {
  const values = data.map(d => Number(d[metric as keyof DiaActividad]) || 0);
  const max = Math.max(...values, 1);
  const W = 560;
  const H = 160;
  const PAD = 24;
  const bw = (W - PAD * 2) / data.length;
  const color = METRICAS[metric]?.color || COLORES.AMBER;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map(g => {
        const y = H - PAD - (H - PAD * 2) * g;
        return (
          <line key={g} x1={PAD} x2={W - PAD} y1={y} y2={y} stroke={COLORES.BORDER} strokeWidth="1" />
        );
      })}
      {data.map((d, i) => {
        const h = ((values[i]) / max) * (H - PAD * 2 - 6);
        const x = PAD + i * bw + bw * 0.25;
        const y = H - PAD - Math.max(h, 2);
        return (
          <g key={d.fecha}>
            <title>{`${d.fecha}: ${values[i]}`}</title>
            <rect x={x} y={y} width={bw * 0.5} height={Math.max(h, 2)} fill={color} rx="2" />
            {i % 2 === 0 && (
              <text
                x={x + bw * 0.25}
                y={H - PAD + 12}
                fontSize="9"
                fill={COLORES.COMMENT}
                textAnchor="middle"
              >
                {new Date(`${d.fecha}T00:00:00`).getDate()}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [actividad, setActividad] = useState<DiaActividad[]>([]);
  const [metrica, setMetrica] = useState('logins');
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [experiencia, setExperiencia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sesion = getSesion();

  const fetchData = useCallback(async () => {
    try {
      const [projs, skls, blogPosts, exp, stats, actividadData] = await Promise.all([
        api.get<any[]>('/publico/proyectos').catch(() => []),
        api.get<any[]>('/publico/skills').catch(() => []),
        sesion ? api.get<any>('/publico/posts?pagina=0&tam=3').catch(() => ({ content: [] })) : Promise.resolve({ content: [] }),
        api.get<any[]>('/publico/experiencia').catch(() => []),
        sesion ? api.get<DashboardData>('/admin/dashboard').catch(() => ({ proyectos: 0, posts: 0, skills: 0, mensajes: 0 })) : Promise.resolve({ proyectos: 0, posts: 0, skills: 0, mensajes: 0 }),
        sesion ? api.get<DiaActividad[]>('/admin/actividad').catch(() => []) : Promise.resolve([]),
      ]);
      setProyectos(projs.slice(0, 3));
      setSkills(skls);
      setPosts(blogPosts.content || []);
      setExperiencia(exp.slice(0, 2));
      setData(stats);
      setActividad(actividadData || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [sesion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingBlock />;

  return (
    <>
      <SEO title="Dashboard" description="Panel de control con estadísticas del portafolio" />
      <div>
      <GlobalBanner />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{(data?.proyectos ?? 0).toString().padStart(2, '0')}</div>
          <div className="stat-label">proyectos activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(data?.posts ?? 0).toString().padStart(2, '0')}</div>
          <div className="stat-label">posts publicados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(data?.skills ?? 0).toString().padStart(2, '0')}</div>
          <div className="stat-label">skills registradas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(data?.mensajes ?? 0).toString().padStart(2, '0')}</div>
          <div className="stat-label">mensajes recibidos</div>
        </div>
      </div>

      {actividad.length > 0 && (
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>{'// Actividad (14 días)'}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Object.entries(METRICAS).map(([key, m]) => (
                <button
                  key={key}
                  className={metrica === key ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setMetrica(key)}
                  style={{ fontSize: '9px', padding: '3px 10px' }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <MetricChart data={actividad} metric={metrica} />
          </div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '9px', color: 'var(--ds-comment)', flexWrap: 'wrap' }}>
            {Object.entries(METRICAS).map(([key, m]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: m.color, display: 'inline-block' }}></span>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="card">
          <div className="card-title">{'// Proyectos recientes'}</div>
          {proyectos.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)', padding: '12px 0', textAlign: 'center' }}>
              No hay proyectos registrados
            </div>
          ) : (
            proyectos.map((p: any) => (
              <div key={p.id} className="project-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${p.slug}`)}>
                <div className="project-dot"></div>
                <div style={{ flex: 1 }}>
                  <div className="project-name">{p.titulo}</div>
                  <div className="project-tech">
                    {p.tecnologias?.map((t: any) => (
                      <span key={t.id} className="tag" style={{ borderColor: t.color ? `${t.color}44` : undefined, color: t.color || undefined }}>{t.nombre}</span>
                    ))}
                  </div>
                </div>
                {p.destacado && <span style={{ fontSize: '9px', color: 'var(--ds-amber)' }}>★</span>}
              </div>
            ))
          )}
          {sesion && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #1a1a1a', paddingTop: '10px', textAlign: 'right' }}>
              <button className="btn-secondary" onClick={() => navigate('/projects')} style={{ fontSize: '10px', padding: '3px 10px' }}>
                ver todos →
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">{'// Skills top'}</div>
          {skills.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)', padding: '12px 0', textAlign: 'center' }}>
              No hay skills registradas
            </div>
          ) : (
            skills.slice(0, 5).map((s: any) => (
              <div key={s.id} className="skill-row">
                <div className="skill-name">{s.nombre}</div>
                <div className="skill-track">
                  <div className="skill-fill" style={{ width: `${s.nivel}%` }}></div>
                </div>
                <div className="skill-pct">{s.nivel}%</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="card">
          <div className="card-title">{'// Últimos posts'}</div>
          {posts.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)', padding: '12px 0', textAlign: 'center' }}>
              No hay posts publicados
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} className="project-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="project-dot" style={{ background: post.categoria?.color || 'var(--ds-amber)' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="project-name" style={{ fontSize: '11px' }}>{post.titulo}</div>
                  <div className="project-tech">
                    {new Date(post.publicadoEn).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    <span style={{ margin: '0 6px' }}>·</span>
                    {post.tiempoLectura} min
                    <span style={{ margin: '0 6px' }}>·</span>
                    {post.vistas} vistas
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title">{'// Experiencia reciente'}</div>
          {experiencia.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--ds-comment)', padding: '12px 0', textAlign: 'center' }}>
              No hay experiencia registrada
            </div>
          ) : (
            experiencia.map((e: any) => (
              <div key={e.id} className="project-item">
                <div className="project-dot"></div>
                <div style={{ flex: 1 }}>
                  <div className="project-name" style={{ fontSize: '11px', color: 'var(--ds-amber)' }}>{e.puesto}</div>
                  <div className="project-tech">{e.empresa}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {sesion && (
        <div className="card" style={{ marginTop: '12px' }}>
          <div className="card-title">{'// Terminal rápida'}</div>
          <div className="terminal-box">
            <div className="terminal-line cmd">$ whoami</div>
            <div className="terminal-line out">Sebastián Gómez</div>
            <div className="terminal-line out">Node.js, React, TypeScript y PostgreSQL</div>
            <div className="terminal-line cmd" style={{ marginTop: '6px' }}>$ session --status</div>
            <div className="terminal-line ok">Active session · {sesion.correo} · role: {sesion.rol.toLowerCase()}</div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DashboardPage;
