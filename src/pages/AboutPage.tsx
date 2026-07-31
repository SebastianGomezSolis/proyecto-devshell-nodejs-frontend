import React from 'react';
import GlobalBanner from '../components/GlobalBanner';

const AboutPage: React.FC = () => {
  const techs = [
    { name: 'Node.js', cat: 'Backend' },
    { name: 'PostgreSQL', cat: 'Database' },
    { name: 'React 19', cat: 'Frontend' },
    { name: 'TypeScript', cat: 'Frontend' },
    { name: 'JWT', cat: 'Security' },
    { name: 'BCrypt', cat: 'Security' },
    { name: 'CSS3', cat: 'Frontend' },
    { name: 'REST API', cat: 'Backend' },
  ];

  return (
    <div className="page-enter">
      <GlobalBanner />

      <div className="card">
        <div className="card-title">{'// Acerca de devshell'}</div>
        <div style={{ fontSize: '12px', color: '#a0a09a', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '12px' }}>
            DevShell es un portafolio personal interactivo con diseño de una terminal.
            Combina un backend robusto en Java Spring Boot con un frontend React TypeScript.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Incluye gestión completa de proyectos, blog, habilidades técnicas, experiencia,
            tablero Kanban, terminal interactiva simulada y sistema de contacto.
          </p>
          <p style={{ marginBottom: '12px' }}>
            El diseño está inspirado en terminales clásicas y la estética brutalista,
            priorizando legibilidad y funcionalidad sobre decoración.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{'// Stack tecnológico'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {techs.map((t, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#f5f5f0' }}>{t.name}</span>
              <span style={{ fontSize: '10px', color: '#504f4a' }}>{t.cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">{'// Estadísticas del sistema'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { label: 'versión', value: '2.0.2' },
            { label: 'backend', value: 'Node.js' },
            { label: 'frontend', value: 'React + TypeScript' },
            { label: 'base de datos', value: 'PostgreSQL' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '9px', color: '#504f4a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 500 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
