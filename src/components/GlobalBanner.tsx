import React from 'react';
import { useLocation } from 'react-router-dom';

interface BannerConfig {
  title: string;
  subtitle: string;
}

const bannerConfig: Record<string, BannerConfig> = {
  '/': { title: 'Devshell', subtitle: 'Portafolio personal interactivo' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen general del portafolio' },
  '/projects': { title: 'Proyectos', subtitle: 'Portafolio de proyectos' },
  '/blog': { title: 'Blog', subtitle: 'Artículos técnicos' },
  '/skills': { title: 'Skills', subtitle: 'Habilidades técnicas y experiencia' },
  '/kanban': { title: 'Kanban', subtitle: 'Tablero de tareas' },
  '/terminal': { title: 'Terminal', subtitle: 'Emulador de terminal interactiva' },
  '/contact': { title: 'Contacto', subtitle: 'Envíame un mensaje' },
  '/settings': { title: 'Configuración', subtitle: 'Preferencias del sistema' },
  '/profile': { title: 'Perfil', subtitle: 'Información de cuenta' },
  '/about': { title: 'Acerca de', subtitle: 'Curriculum vitae y perfil' },
  '/mis-contenido': { title: 'Mi Contenido', subtitle: 'Gestiona tu propio portafolio' },
  '/admin/mensajes': { title: 'Mensajes', subtitle: 'Bandeja de entrada' },
  '/admin/contenido': { title: 'Contenido', subtitle: 'Administrar contenido del portafolio' },
  '/admin/cv': { title: 'CV', subtitle: 'Administrar CV' },
};

const GlobalBanner: React.FC = () => {
  const location = useLocation();

  if (location.pathname === '/') return null;

  const config = bannerConfig[location.pathname] || { title: 'Devshell', subtitle: 'Portafolio personal' };

  return (
    <div className="page-header">
      <div className="page-title">{config.title}</div>
      <div className="page-sub">{'// '}{config.subtitle}</div>
    </div>
  );
};

export default GlobalBanner;
