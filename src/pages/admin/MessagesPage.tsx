import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import LoadingBlock from '../../components/LoadingBlock';
import ModalDialog from '../../components/ModalDialog';
import { formatFecha } from '../../utils/formatters';

const MessagesPage: React.FC = () => {
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMsg, setViewMsg] = useState<any>(null);
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());

  const fetchMensajes = async () => {
    try {
      const data = await api.get<any[]>('/admin/mensajes');
      setMensajes(data);
    } catch {
      setMensajes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const withBusy = async (id: number, fn: () => Promise<void>) => {
    setBusyIds(prev => new Set(prev).add(id));
    try { await fn(); } finally { setBusyIds(prev => { const next = new Set(prev); next.delete(id); return next; }); }
  };

  const handleMarcarLeido = (id: number) => {
    setMensajes(prev => prev.map(m => m.id === id ? { ...m, leido: true } : m));
    api.put<any>(`/admin/mensajes/${id}/leido`).catch(() =>
      setMensajes(prev => prev.map(m => m.id === id ? { ...m, leido: false } : m))
    );
  };

  const handleEliminar = (id: number) => {
    if (!window.confirm('¿Eliminar mensaje?')) return;
    withBusy(id, async () => {
      const deleted = mensajes.find(m => m.id === id);
      setViewMsg((prev: any) => prev?.id === id ? null : prev);
      setMensajes(prev => prev.filter(m => m.id !== id));
      try { await api.del(`/admin/mensajes/${id}`); }
      catch { if (deleted) setMensajes(prev => [...prev, deleted]); }
    });
  };

  const openMensaje = (m: any) => {
    setViewMsg(m);
    if (!m.leido) handleMarcarLeido(m.id);
  };

  if (loading) return <LoadingBlock />;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="page-title">Mensajes</div>
        <div className="page-sub">{'// Bandeja de entrada'}</div>
      </div>

      {mensajes.length === 0 ? (
        <div className="empty-state">No hay mensajes</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Asunto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m: any) => (
              <tr key={m.id}
                onClick={() => openMensaje(m)}
                style={{ opacity: m.leido ? 0.6 : 1, cursor: 'pointer' }}>
                <td>
                  <div style={{
                    width: '8px', height: '8px',
                    background: m.leido ? 'var(--ds-border)' : 'var(--ds-amber)',
                  }}></div>
                </td>
                <td>{m.nombre}</td>
                <td>{m.correo}</td>
                <td>{m.asunto || '—'}</td>
                <td>{formatFecha(m.recibidoEn)}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn-secondary" onClick={() => openMensaje(m)}
                      disabled={busyIds.has(m.id)}
                      style={{ fontSize: '9px', padding: '2px 6px', opacity: busyIds.has(m.id) ? 0.5 : 1 }}>
                        {m.leido ? 'ver' : 'leer'}
                    </button>
                    <button className="btn-secondary" onClick={() => handleEliminar(m.id)}
                      disabled={busyIds.has(m.id)}
                      style={{ fontSize: '9px', padding: '2px 6px', color: 'var(--ds-red)', opacity: busyIds.has(m.id) ? 0.5 : 1 }}>
                      {busyIds.has(m.id) ? '…' : 'eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ModalDialog open={!!viewMsg} onClose={() => setViewMsg(null)} title="Mensaje" width="520px">
        {viewMsg && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>De</div>
              <div style={{ fontSize: '13px', color: 'var(--ds-text)' }}>{viewMsg.nombre}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>Correo</div>
              <div style={{ fontSize: '13px', color: 'var(--ds-text)' }}>{viewMsg.correo}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>Asunto</div>
              <div style={{ fontSize: '13px', color: 'var(--ds-amber)' }}>{viewMsg.asunto || '—'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--ds-comment)' }}>Fecha</div>
              <div style={{ fontSize: '12px', color: 'var(--ds-subtle)' }}>{formatFecha(viewMsg.recibidoEn)}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginBottom: '4px' }}>Mensaje</div>
              <div style={{
                fontSize: '12px', color: 'var(--ds-subtle)', lineHeight: 1.6,
                background: 'var(--ds-panel)', padding: '12px', whiteSpace: 'pre-wrap',
              }}>
                {viewMsg.mensaje || '—'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', borderTop: '1px solid var(--ds-border)', paddingTop: '12px' }}>
              <button className="btn-secondary" onClick={() => { setViewMsg(null); }}
                style={{ fontSize: '10px', padding: '4px 10px' }}>
                cerrar
              </button>
              <button className="btn-secondary" onClick={() => { handleEliminar(viewMsg.id); }}
                style={{ fontSize: '10px', padding: '4px 10px', color: 'var(--ds-red)' }}>
                eliminar
              </button>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
};

export default MessagesPage;
