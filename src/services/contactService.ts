import { api } from '../utils/api';
import type { ContactRequest, Mensaje } from '../utils/types';

export const contactService = {
  async send(data: ContactRequest): Promise<string> {
    return api.post<string>('/publico/contacto', data);
  },

  async getAll(): Promise<Mensaje[]> {
    return api.get<Mensaje[]>('/admin/mensajes');
  },

  async marcarLeido(id: number): Promise<Mensaje> {
    return api.put<Mensaje>(`/admin/mensajes/${id}/leido`);
  },

  async marcarRespondido(id: number): Promise<Mensaje> {
    return api.put<Mensaje>(`/admin/mensajes/${id}/respondido`);
  },

  async remove(id: number): Promise<void> {
    return api.del(`/admin/mensajes/${id}`);
  },
};
