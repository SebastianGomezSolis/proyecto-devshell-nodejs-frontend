import React from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', marginBottom: '16px', color: '#504f4a' }}>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#2a2a2a' }}>/</span>}
          {crumb.to ? (
            <Link to={crumb.to} style={{ color: '#a0a09a', textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: '#f59e0b' }}>{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
