import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import GlobalBanner from '../components/GlobalBanner';
import SEO from '../components/SEO';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pagina: String(pagina), tam: '10' });
      if (busqueda) params.append('busqueda', busqueda);
      if (categoriaFiltro) params.append('categoria', categoriaFiltro);
      const data = await api.get<any>(`/publico/posts?${params}`);
      setPosts(data.content || []);
      setTotalPaginas(data.totalPages || 0);
      setTotalElementos(data.totalElements || 0);
    } catch {
      setPosts([]);
      setTotalPaginas(0);
      setTotalElementos(0);
    } finally {
      setLoading(false);
    }
  }, [pagina, busqueda, categoriaFiltro]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await api.get<any[]>('/publico/categorias');
        setCategorias(data);
      } catch {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    setPagina(0);
  };

  return (
    <>
      <SEO title="Blog" description="Artículos sobre desarrollo, tecnología y programación" />
      <div>
      <GlobalBanner />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={busqueda}
          onChange={handleSearch}
          style={{ maxWidth: '350px', fontSize: '12px' }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => { setCategoriaFiltro(e.target.value); setPagina(0); }}
          style={{ maxWidth: '200px', fontSize: '12px' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c: any) => (
            <option key={c.id} value={c.slug}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingBlock />
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>∅</div>
          <div>No se encontraron artículos</div>
          <div style={{ fontSize: '10px', marginTop: '4px', color: 'var(--ds-border)' }}>
            {busqueda || categoriaFiltro ? 'Intenta con otros filtros' : 'No hay posts publicados aún'}
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '10px', color: 'var(--ds-comment)', marginBottom: '10px' }}>
            {totalElementos} artículo{totalElementos !== 1 ? 's' : ''} encontrado{totalElementos !== 1 ? 's' : ''}
            {pagina > 0 && ` · página ${pagina + 1} de ${totalPaginas}`}
          </div>

          {posts.map((post: any) => (
            <div
              key={post.id}
              className="blog-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                {post.portadaUrl && (
                  <div style={{ width: '80px', height: '80px', flexShrink: 0, background: 'var(--ds-muted)', border: '1px solid var(--ds-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={post.portadaUrl} alt={post.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="blog-card-title">{post.titulo}</div>
                  <div className="blog-card-meta">
                    {post.categoria && (
                      <span style={{ color: post.categoria.color || 'var(--ds-amber)' }}>
                        {post.categoria.nombre}
                      </span>
                    )}
                    <span style={{ margin: '0 8px' }}>·</span>
                    {new Date(post.publicadoEn).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    <span style={{ margin: '0 8px' }}>·</span>
                    {post.tiempoLectura} min de lectura
                    <span style={{ margin: '0 8px' }}>·</span>
                    {post.vistas} vistas
                  </div>
                  {post.extracto && (
                    <div className="blog-card-excerpt">{post.extracto}</div>
                  )}
                  {post.tags?.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      {post.tags.map((tag: any) => (
                        <span key={tag.id} className="tag">{tag.nombre}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <button
                className="btn-secondary"
                disabled={pagina === 0}
                onClick={() => setPagina(p => Math.max(0, p - 1))}
                style={{ fontSize: '10px', padding: '4px 12px' }}
              >
                ← anterior
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPaginas }, (_, i) => i).map(i => (
                  <button
                    key={i}
                    className={pagina === i ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setPagina(i)}
                    style={{ fontSize: '10px', padding: '4px 8px', minWidth: '28px' }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="btn-secondary"
                disabled={pagina >= totalPaginas - 1}
                onClick={() => setPagina(p => p + 1)}
                style={{ fontSize: '10px', padding: '4px 12px' }}
              >
                siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
};

export default BlogPage;
