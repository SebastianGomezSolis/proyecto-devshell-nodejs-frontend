import React from 'react';

interface SectionTitleProps {
  titulo: string;
  descripcion?: string;
  accion?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ titulo, descripcion, accion }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        borderBottom: '1px solid var(--ds-muted)',
        paddingBottom: '10px',
      }}
    >
      <div>
        <div style={{ fontSize: '9px', color: 'var(--ds-comment)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
          // {descripcion || 'sección'}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ds-text)' }}>
          {titulo}
        </div>
      </div>
      {accion && <div>{accion}</div>}
    </div>
  );
};

export default SectionTitle;
