import { api } from '../utils/api';
import type { DashboardStats, Board, Skill, Experiencia, Usuario } from '../utils/types';

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/admin/dashboard');
  },

  async getBoards(): Promise<Board[]> {
    return api.get<Board[]>('/admin/boards');
  },

  async getBoard(id: number): Promise<Board> {
    return api.get<Board>(`/admin/boards/${id}`);
  },

  async createBoard(data: { nombre: string }): Promise<Board> {
    return api.post<Board>('/admin/boards', data);
  },

  async addColumna(boardId: number, data: { titulo: string }): Promise<void> {
    return api.post(`/admin/boards/${boardId}/columnas`, data);
  },

  async addCard(boardId: number, columnaId: number, data: { titulo: string }): Promise<void> {
    return api.post(`/admin/boards/${boardId}/columnas/${columnaId}/cards`, data);
  },

  async deleteCard(cardId: number): Promise<void> {
    return api.del(`/admin/cards/${cardId}`);
  },

  async getSkills(): Promise<Skill[]> {
    return api.get<Skill[]>('/admin/skills');
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    return api.post<Skill>('/admin/skills', data);
  },

  async deleteSkill(id: number): Promise<void> {
    return api.del(`/admin/skills/${id}`);
  },

  async getExperiencia(): Promise<Experiencia[]> {
    return api.get<Experiencia[]>('/admin/experiencia');
  },

  async createExperiencia(data: Partial<Experiencia>): Promise<Experiencia> {
    return api.post<Experiencia>('/admin/experiencia', data);
  },

  async deleteExperiencia(id: number): Promise<void> {
    return api.del(`/admin/experiencia/${id}`);
  },

  async getUsuariosPendientes(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/admin/usuarios/pendientes');
  },

  async getUsuarios(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/admin/usuarios');
  },

  async aprobarUsuario(id: number): Promise<Usuario> {
    return api.put<Usuario>(`/admin/usuarios/${id}/aprobar`);
  },

  async desactivarUsuario(id: number): Promise<Usuario> {
    return api.put<Usuario>(`/admin/usuarios/${id}/desactivar`);
  },
};
