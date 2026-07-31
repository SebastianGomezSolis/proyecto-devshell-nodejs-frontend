import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSesion } from '../utils/auth';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const sesion = getSesion();

  return (
    <>
      <SEO description="Portafolio personal interactivo con terminal brutalista — Proyectos, Blog, Skills y más" />
      <div>
      <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#f59e0b', letterSpacing: '-0.02em' }}>
          dev<span style={{ color: '#504f4a' }}>/</span>shell<span style={{ color: '#504f4a' }}>_</span>
        </div>
        <div style={{ fontSize: '12px', color: '#504f4a', marginTop: '8px' }}>
          {'// '}Portafolio personal interactivo
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
        <div className="terminal-box">
          <div className="terminal-line cmd">$ whoami</div>
          <div className="terminal-line out">Sebastián Gómez</div>
          <div className="terminal-line cmd" style={{ marginTop: '8px' }}>$ ls skills/</div>
          <div className="terminal-line out">Java, Spring Boot, React, TypeScript y PostgreSQL</div>
          <div className="terminal-line cmd" style={{ marginTop: '8px' }}>$ cat about.md</div>
          <div className="terminal-line out">Desarrollador apasionado por construir</div>
          <div className="terminal-line out">aplicaciones web y aprender cada dia.</div>
          <div className="terminal-line cmd" style={{ marginTop: '8px' }}>
            {sesion ? '$ session --status' : '$ welcome --guest'}
          </div>
          <div className="terminal-line ok">
            {sesion
              ? `Active session · ${sesion.correo} · role: ${sesion.rol.toLowerCase()}`
              : 'Guest user · login to access dashboard'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
        {[
          { path: '/projects', label: 'ver proyectos' },
          { path: '/blog', label: 'leer blog' },
          { path: '/skills', label: 'habilidades' },
          { path: '/terminal', label: 'terminal' },
          { path: '/contact', label: 'contacto' },
        ].map(item => (
          <button
            key={item.path}
            className="btn-secondary"
            onClick={() => navigate(item.path)}
            style={{ fontSize: '11px', padding: '6px 16px' }}
          >
            {item.label} →
          </button>
        ))}
      </div>

      {!sesion && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ fontSize: '12px', padding: '8px 24px' }}
          >
            iniciar sesión →
          </button>
        </div>
      )}

      {sesion && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{ fontSize: '12px', padding: '8px 24px' }}
          >
            ir al dashboard →
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default HomePage;
