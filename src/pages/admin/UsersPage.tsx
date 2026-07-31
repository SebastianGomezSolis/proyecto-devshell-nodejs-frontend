import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import LoadingBlock from '../../components/LoadingBlock';
import SEO from '../../components/SEO';
import { formatFecha } from '../../utils/formatters';

interface UsuarioConEstado {
  id: number;
  correo: string;
  rol: string;
  activo: boolean;
  creadoEn: string;
}

const UsersPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConEstado[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pendientes' | 'todos'>('pendientes');

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const data = tab === 'pendientes'
        ? await adminService.getUsuariosPendientes()
        : await adminService.getUsuarios();
      setUsuarios(data as UsuarioConEstado[]);
    } catch {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleAprobar = async (id: number) => {
    try {
      await adminService.aprobarUsuario(id);
      fetchUsuarios();
    } catch {
      // fallback
    }
  };

  const handleDesactivar = async (id: number) => {
    if (!window.confirm('¿Desactivar este usuario? Podrá reactivarse después.')) return;
    try {
      await adminService.desactivarUsuario(id);
      fetchUsuarios();
    } catch {
      // fallback
    }
  };

  return (
    <>
      <SEO title="Usuarios" description="Administración de usuarios del sistema" />
      <div className="page-header">
        <div className="page-title">Usuarios</div>
        <div className="page-sub">Administración y aprobación de cuentas</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          className={tab === 'pendientes' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('pendientes')}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Pendientes
        </button>
        <button
          className={tab === 'todos' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('todos')}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Todos
        </button>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : usuarios.length === 0 ? (
        <div style={{ color: 'var(--ds-comment)', fontSize: '13px', padding: '20px 0' }}>
          {tab === 'pendientes' ? 'No hay usuarios pendientes de aprobación.' : 'No hay usuarios registrados.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--ds-comment)' }}>{u.id}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: u.activo ? 'var(--ds-green)' : 'var(--ds-red)',
                          display: 'inline-block',
                        }}
                      />
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--ds-comment)' }}>
                    {formatFecha(u.creadoEn)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {!u.activo && (
                        <button
                          className="btn-primary"
                          onClick={() => handleAprobar(u.id)}
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Aprobar
                        </button>
                      )}
                      {u.activo && u.rol !== 'ADMIN' && (
                        <button
                          className="btn-secondary"
                          onClick={() => handleDesactivar(u.id)}
                          style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--ds-red)' }}
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UsersPage;
