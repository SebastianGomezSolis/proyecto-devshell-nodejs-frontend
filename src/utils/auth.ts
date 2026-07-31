import { API_BASE } from './constants';

export interface Sesion {
  id: number;
  correo: string;
  rol: string;
  referenciaId: number;
  token: string;
}

export function decodificarToken(token: string): Sesion | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      correo: payload.sub,
      rol: payload.rol,
      referenciaId: payload.referenciaId,
      token,
    };
  } catch {
    return null;
  }
}

export function getSesion(): Sesion | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return decodificarToken(token);
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function isAdmin(): boolean {
  const sesion = getSesion();
  return sesion?.rol === 'ADMIN';
}

export function logout(): void {
  localStorage.removeItem('token');
  fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
  window.dispatchEvent(new Event('token-changed'));
  window.location.href = '/';
}
