import React, { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import GlobalBanner from '../components/GlobalBanner';

const etiquetaConfig: Record<string, { color: string; label: string }> = {
  NINGUNA: { color: 'var(--ds-border)', label: 'Sin etiqueta' },
  ROJO: { color: 'var(--ds-red)', label: 'Urgente' },
  VERDE: { color: 'var(--ds-green)', label: 'Completado' },
  AMBAR: { color: 'var(--ds-amber)', label: 'En revisión' },
  AZUL: { color: '#3b82f6', label: 'Mejora' },
};

const KanbanPage: React.FC = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showAddCard, setShowAddCard] = useState<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const timeout = setTimeout(() => {
      if (mountedRef.current) setLoading(false);
    }, 7000);
    return () => { mountedRef.current = false; clearTimeout(timeout); };
  }, []);

  const fetchBoards = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/admin/boards');
      if (mountedRef.current) setBoards(data || []);
      return data || [];
    } catch {
      if (mountedRef.current) setBoards([]);
      return [];
    }
  }, []);

  const loadBoard = useCallback(async (id: number) => {
    try {
      const data = await api.get<any>(`/admin/boards/${id}`);
      if (mountedRef.current) setSelectedBoard(data);
    } catch {
      if (mountedRef.current) setSelectedBoard(null);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchBoards();
      if (cancelled) return;
      if (data.length > 0) {
        await loadBoard(data[0].id);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [fetchBoards, loadBoard]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const board = await api.post<any>('/admin/boards', { nombre: newBoardName.trim() });
      setBoards(prev => [...prev, board]);
      setSelectedBoard(board);
      setNewBoardName('');
      setShowCreateBoard(false);
    } catch {
      setErrorMsg('Error al crear board');
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim() || !selectedBoard) return;
    try {
      await api.post<any>(`/admin/boards/${selectedBoard.id}/columnas`, { titulo: newColumnTitle.trim() });
      setNewColumnTitle('');
      setShowAddColumn(false);
      loadBoard(selectedBoard.id);
    } catch {
      setErrorMsg('Error al agregar columna');
    }
  };

  const handleAddCard = async (columnaId: number) => {
    if (!newCardTitle.trim() || !selectedBoard) return;
    try {
      await api.post<any>(`/admin/boards/${selectedBoard.id}/columnas/${columnaId}/cards`, { titulo: newCardTitle.trim() });
      setNewCardTitle('');
      setShowAddCard(null);
      loadBoard(selectedBoard.id);
    } catch {
      setErrorMsg('Error al agregar tarjeta');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!window.confirm('Eliminar tarjeta?')) return;
    try {
      await api.del(`/admin/cards/${cardId}`);
      if (selectedBoard) loadBoard(selectedBoard.id);
    } catch {
      setErrorMsg('Error al eliminar tarjeta');
    }
  };

  const totalCards = selectedBoard?.columnas?.reduce((acc: number, col: any) => acc + (col.cards?.length || 0), 0) || 0;

  if (loading) return <LoadingBlock />;

  return (
    <div className="page-enter">
      <GlobalBanner />

      {errorMsg && (
        <div style={{ color: 'var(--ds-red)', fontSize: '11px', marginBottom: '10px', border: '1px solid var(--ds-red)', padding: '8px 12px', background: '#160a0a' }}>
          {errorMsg}
          <button onClick={() => setErrorMsg('')} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'var(--ds-red)', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>✕</button>
        </div>
      )}

      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: 'var(--ds-comment)' }}>
            {boards.length > 0 ? `${boards.length} board(s)  ${totalCards} tarjeta(s)` : 'No hay boards'}
          </div>
          <button className="btn-primary" onClick={() => setShowCreateBoard(true)} style={{ fontSize: '10px', padding: '4px 12px' }}>
            + nuevo board
          </button>
        </div>

        {showCreateBoard && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input type="text" placeholder="Nombre del board..." value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} style={{ fontSize: '12px', flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateBoard(); if (e.key === 'Escape') setShowCreateBoard(false); }} autoFocus />
            <button className="btn-primary" onClick={handleCreateBoard} style={{ fontSize: '10px', padding: '4px 12px' }}>crear</button>
            <button className="btn-secondary" onClick={() => setShowCreateBoard(false)} style={{ fontSize: '10px', padding: '4px 12px' }}>cancelar</button>
          </div>
        )}

        {boards.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
            {boards.map((b: any) => (
              <button key={b.id} className={selectedBoard?.id === b.id ? 'btn-primary' : 'btn-secondary'} onClick={() => loadBoard(b.id)} style={{ fontSize: '10px', padding: '4px 10px' }}>
                {b.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {!selectedBoard ? (
        <div className="empty-state">
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⊞</div>
          <div>Selecciona o crea un board para empezar</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ds-amber)' }}>{selectedBoard.nombre}</div>
              {selectedBoard.descripcion && <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginTop: '2px' }}>{selectedBoard.descripcion}</div>}
            </div>
            <button className="btn-secondary" onClick={() => setShowAddColumn(true)} style={{ fontSize: '10px', padding: '4px 10px' }}>+ columna</button>
          </div>

          {showAddColumn && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" placeholder="Nombre de la columna..." value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} style={{ fontSize: '12px', maxWidth: '300px' }} onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); if (e.key === 'Escape') setShowAddColumn(false); }} autoFocus />
              <button className="btn-primary" onClick={handleAddColumn} style={{ fontSize: '10px', padding: '4px 10px' }}>agregar</button>
              <button className="btn-secondary" onClick={() => setShowAddColumn(false)} style={{ fontSize: '10px', padding: '4px 10px' }}>x</button>
            </div>
          )}

          <div className="kanban-columns">
            {(!selectedBoard.columnas || selectedBoard.columnas.length === 0) ? (
              <div className="empty-state" style={{ width: '100%' }}>Agrega una columna para empezar</div>
            ) : (
              selectedBoard.columnas.map((col: any) => (
                <div key={col.id} className="kanban-col">
                  <div className="kanban-col-header">
                    <span>{col.titulo}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--ds-comment)' }}>{col.cards?.length || 0}</span>
                  </div>
                  {col.cards?.map((card: any) => (
                    <div key={card.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ width: '8px', height: '8px', background: etiquetaConfig[card.etiqueta]?.color || 'var(--ds-border)', marginBottom: '6px' }} title={etiquetaConfig[card.etiqueta]?.label}></div>
                          <div style={{ color: 'var(--ds-text)', fontSize: '11px', marginBottom: '4px' }}>{card.titulo}</div>
                          {card.descripcion && <div style={{ color: 'var(--ds-comment)', fontSize: '10px', marginTop: '4px', lineHeight: 1.4 }}>{card.descripcion}</div>}
                        </div>
                        <button onClick={() => handleDeleteCard(card.id)} style={{ background: 'none', border: 'none', color: 'var(--ds-red)', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: '10px', opacity: 0.5 }}>✕</button>
                      </div>
                      {card.fechaLimite && <div style={{ fontSize: '9px', color: 'var(--ds-comment)', marginTop: '6px', borderTop: '1px solid #1a1a1a', paddingTop: '4px' }}>{new Date(card.fechaLimite).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' })}</div>}
                    </div>
                  ))}
                  {(!col.cards || col.cards.length === 0) && <div style={{ padding: '16px', fontSize: '10px', color: 'var(--ds-comment)', textAlign: 'center' }}>Sin tarjetas</div>}
                  {showAddCard === col.id ? (
                    <div style={{ padding: '8px' }}>
                      <input type="text" placeholder="Titulo..." value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} style={{ fontSize: '11px', marginBottom: '6px' }} onKeyDown={(e) => { if (e.key === 'Enter') handleAddCard(col.id); if (e.key === 'Escape') { setShowAddCard(null); setNewCardTitle(''); } }} autoFocus />
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn-primary" onClick={() => handleAddCard(col.id)} style={{ fontSize: '9px', padding: '2px 8px' }}>+</button>
                        <button className="btn-secondary" onClick={() => { setShowAddCard(null); setNewCardTitle(''); }} style={{ fontSize: '9px', padding: '2px 8px' }}>x</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '8px', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid var(--ds-muted)', fontSize: '10px', color: 'var(--ds-comment)' }} onClick={() => setShowAddCard(col.id)}>+ agregar tarjeta</div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanPage;
