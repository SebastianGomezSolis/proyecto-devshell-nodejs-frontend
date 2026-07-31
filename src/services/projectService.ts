import { api } from '../utils/api';
import type { Proyecto, Tecnologia } from '../utils/types';

export const projectService = {
  async getAll(): Promise<Proyecto[]> {
    return api.get<Proyecto[]>('/publico/proyectos');
  },

  async getBySlug(slug: string): Promise<Proyecto> {
    return api.get<Proyecto>(`/publico/proyectos/${slug}`);
  },

  async getTecnologias(): Promise<Tecnologia[]> {
    return api.get<Tecnologia[]>('/publico/tecnologias');
  },

  async create(data: Partial<Proyecto>): Promise<Proyecto> {
    return api.post<Proyecto>('/admin/proyectos', data);
  },

  async update(id: number, data: Partial<Proyecto>): Promise<Proyecto> {
    return api.put<Proyecto>(`/admin/proyectos/${id}`, data);
  },

  async remove(id: number): Promise<void> {
    return api.del(`/admin/proyectos/${id}`);
  },
};
