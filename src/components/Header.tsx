import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Sesion, logout } from '../utils/auth';

interface HeaderProps {
  sesion: Sesion | null;
}

const Header: React.FC<HeaderProps> = ({ sesion }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('token-changed'));
    navigate('/');
  };

  return (
    <div className="header-prompt">
      <span className="prompt-text">~/devshell $</span>
      <span className="prompt-command">
        {sesion ? 'session --connected' : 'session --offline'}
      </span>
      <span className="prompt-cursor"></span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className="btn-secondary"
          onClick={toggleTheme}
          style={{ padding: '4px 8px', fontSize: '11px', minWidth: '32px' }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        {sesion && (
          <span style={{ fontSize: '12px', color: 'var(--ds-subtle)' }}>
            {sesion.correo}
          </span>
        )}

        {sesion ? (
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '4px 12px', fontSize: '11px' }}>
            logout
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '4px 12px', fontSize: '11px' }}>
            login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
