import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import LoadingBlock from '../components/LoadingBlock';
import SEO from '../components/SEO';
import { formatFecha } from '../utils/formatters';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.get<any>(`/publico/posts/${slug}`);
        setPost(data);
      } catch {
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingBlock />;
  if (!post) return null;

  return (
    <>
      <SEO title={post.titulo} description={post.extracto} type="article" />
      <div>
      <div className="reading-progress">
        <div className="reading-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <button className="btn-secondary" onClick={() => navigate('/blog')} style={{ marginBottom: '16px', fontSize: '11px', padding: '4px 12px' }}>
        ← volver al blog
      </button>

      <div className="page-header">
        <div className="page-title" style={{ fontSize: '24px' }}>{post.titulo}</div>
        <div className="page-sub">
          {post.categoria && <span style={{ color: 'var(--ds-amber)' }}>{post.categoria.nombre}</span>}
          <span style={{ margin: '0 6px' }}>·</span>
          {formatFecha(post.publicadoEn)}
          <span style={{ margin: '0 6px' }}>·</span>
          {post.tiempoLectura} min de lectura
          <span style={{ margin: '0 6px' }}>·</span>
          {post.vistas} vistas
        </div>
      </div>

      {post.tags?.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {post.tags.map((tag: any) => (
            <span key={tag.id} className="tag">{tag.nombre}</span>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{ fontSize: '12px', color: 'var(--ds-subtle)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {post.contenido}
        </div>
      </div>

      {post.relacionados?.length > 0 && (
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-title">{'// Artículos relacionados'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {post.relacionados.map((rel: any) => (
              <div
                key={rel.id}
                className="project-item"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/blog/${rel.slug}`)}
              >
                <div className="project-dot" style={{ background: rel.categoria?.color || 'var(--ds-amber)' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="project-name" style={{ fontSize: '11px' }}>{rel.titulo}</div>
                  <div className="project-tech">
                    {formatFecha(rel.publicadoEn)}
                    <span style={{ margin: '0 6px' }}>·</span>
                    {rel.tiempoLectura} min de lectura
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogDetailPage;
