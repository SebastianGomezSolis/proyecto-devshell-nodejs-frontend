import { api } from '../utils/api';
import { logout as cerrarSesion } from '../utils/auth';
import type { LoginRequest, LoginResponse } from '../utils/types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', data);
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {});
    cerrarSesion();
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
