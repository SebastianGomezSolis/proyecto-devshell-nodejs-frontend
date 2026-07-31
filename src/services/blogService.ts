import { api } from '../utils/api';
import type { Post, Categoria, Tag, PageResponse } from '../utils/types';

export const blogService = {
  async getAll(pagina = 0, tam = 10, busqueda?: string, categoria?: string): Promise<PageResponse<Post>> {
    const params = new URLSearchParams({ pagina: String(pagina), tam: String(tam) });
    if (busqueda) params.append('busqueda', busqueda);
    if (categoria) params.append('categoria', categoria);
    return api.get<PageResponse<Post>>(`/publico/posts?${params}`);
  },

  async getBySlug(slug: string): Promise<Post> {
    return api.get<Post>(`/publico/posts/${slug}`);
  },

  async getCategorias(): Promise<Categoria[]> {
    return api.get<Categoria[]>('/publico/categorias');
  },

  async getTags(): Promise<Tag[]> {
    return api.get<Tag[]>('/publico/tags');
  },

  async create(data: Partial<Post>): Promise<Post> {
    return api.post<Post>('/admin/posts', data);
  },

  async togglePublicar(id: number): Promise<Post> {
    return api.put<Post>(`/admin/posts/${id}/publicar`);
  },

  async remove(id: number): Promise<void> {
    return api.del(`/admin/posts/${id}`);
  },
};
