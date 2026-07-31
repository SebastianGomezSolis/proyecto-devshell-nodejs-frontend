import React from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyFn: (row: T) => string | number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

function DataTable<T>({ columns, data, keyFn, emptyMessage, onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#504f4a', fontSize: '12px' }}>
        {emptyMessage || 'No hay datos'}
      </div>
    );
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} style={{ width: col.width, textAlign: col.align || 'left' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={keyFn(row)}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? 'pointer' : undefined }}
          >
            {columns.map((col, i) => (
              <td key={i} style={{ textAlign: col.align || 'left' }}>
                {col.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
