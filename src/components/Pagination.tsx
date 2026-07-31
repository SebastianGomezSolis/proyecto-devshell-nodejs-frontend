import React from 'react';

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  onChange: (pagina: number) => void;
  totalElementos?: number;
}

const Pagination: React.FC<PaginationProps> = ({ pagina, totalPaginas, onChange, totalElementos }) => {
  if (totalPaginas <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 0; i < totalPaginas; i++) {
    if (i === 0 || i === totalPaginas - 1 || (i >= pagina - 1 && i <= pagina + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{
      display: 'flex', gap: '6px', justifyContent: 'center',
      alignItems: 'center', marginTop: '20px',
    }}>
      <button
        className="btn-secondary"
        disabled={pagina === 0}
        onClick={() => onChange(pagina - 1)}
        style={{ fontSize: '10px', padding: '4px 10px' }}
      >
        ← ant
      </button>

      <div style={{ display: 'flex', gap: '4px' }}>
        {pages.map((p, i) =>
          typeof p === 'number' ? (
            <button
              key={i}
              className={pagina === p ? 'btn-primary' : 'btn-secondary'}
              onClick={() => onChange(p)}
              style={{ fontSize: '10px', padding: '4px 8px', minWidth: '28px' }}
            >
              {p + 1}
            </button>
          ) : (
            <span key={i} style={{ color: '#504f4a', padding: '0 4px', fontSize: '10px' }}>…</span>
          )
        )}
      </div>

      <button
        className="btn-secondary"
        disabled={pagina >= totalPaginas - 1}
        onClick={() => onChange(pagina + 1)}
        style={{ fontSize: '10px', padding: '4px 10px' }}
      >
        sig →
      </button>

      {totalElementos !== undefined && (
        <span style={{ fontSize: '10px', color: '#504f4a', marginLeft: '8px' }}>
          {totalElementos} total
        </span>
      )}
    </div>
  );
};

export default Pagination;
