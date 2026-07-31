import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sesion } from '../utils/auth';

interface SidebarProps {
  sesion: Sesion | null;
}

interface SidebarItem {
  to: string;
  label: string;
}

const publicItems: SidebarItem[] = [
  { to: '/', label: 'Inicio' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/blog', label: 'Blog' },
  { to: '/skills', label: 'Skills' },
  { to: '/terminal', label: 'Terminal' },
  { to: '/contact', label: 'Contacto' },
];

const authItems: SidebarItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/kanban', label: 'Kanban' },
  { to: '/mis-contenido', label: 'Mi Contenido' },
  { to: '/settings', label: 'Configuración' },
  { to: '/profile', label: 'Perfil' },
];

const adminItems: SidebarItem[] = [
  { to: '/admin/mensajes', label: 'Mensajes' },
  { to: '/admin/contenido', label: 'Contenido' },
  { to: '/admin/cv', label: 'CV' },
  { to: '/admin/usuarios', label: 'Usuarios' },
];

const Sidebar: React.FC<SidebarProps> = ({ sesion }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          dev<span>/</span>shell<span>_</span>
        </NavLink>
      </div>

      {publicItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
        >
          <div className="sidebar-nav-dot"></div>
          <span>{item.label}</span>
        </NavLink>
      ))}

      {sesion && (
        <>
          <div className="sidebar-nav-section">{'// sesión'}</div>
          {authItems.filter(item => sesion.rol !== 'ADMIN' || item.to !== '/mis-contenido').map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <div className="sidebar-nav-dot"></div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </>
      )}

      {sesion?.rol === 'ADMIN' && (
        <>
          <div className="sidebar-nav-section">{'// admin'}</div>
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <div className="sidebar-nav-dot"></div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </>
      )}

      <NavLink
        to="/about"
        className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
        style={{ marginTop: 'auto' }}
      >
        <div className="sidebar-nav-dot"></div>
        <span>Acerca de</span>
      </NavLink>

      <div className="sidebar-footer">
        <div className="sidebar-footer-email">sebasjose13@gmail.com</div>
        <div className="sidebar-footer-version">v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
