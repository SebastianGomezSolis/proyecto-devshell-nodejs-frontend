export const APP_NAME = 'DevShell';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Portafolio personal e interactivo con terminal brutalista';

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const PAGINATION = {
  TAM_POR_DEFECTO: 10,
  TAM_PEQUENO: 3,
  TAM_GRANDE: 25,
} as const;

export const CATEGORIAS_PROYECTO = ['WEB', 'MOBILE', 'CLI', 'API', 'OTHER'] as const;

export const CATEGORIAS_SKILL = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'DEVOPS', 'OTRO'] as const;

export const TIPOS_EXPERIENCIA = ['TRABAJO', 'EDUCACION', 'CERTIFICACION'] as const;

export const ETIQUETAS_CARD = ['NINGUNA', 'ROJO', 'VERDE', 'AMBAR', 'AZUL'] as const;

export const ETIQUETA_CONFIG: Record<string, { color: string; label: string }> = {
  NINGUNA: { color: '#2a2a2a', label: 'Sin etiqueta' },
  ROJO: { color: '#ef4444', label: 'Urgente' },
  VERDE: { color: '#22c55e', label: 'Completado' },
  AMBAR: { color: '#f59e0b', label: 'En revisión' },
  AZUL: { color: '#3b82f6', label: 'Mejora' },
};

export const CAT_SKILL_LABELS: Record<string, { label: string; color: string }> = {
  FRONTEND: { label: 'Frontend', color: '#61dafb' },
  BACKEND: { label: 'Backend', color: '#6db33f' },
  BASE_DATOS: { label: 'Base de Datos', color: '#4479a1' },
  DEVOPS: { label: 'DevOps', color: '#f05032' },
  OTRO: { label: 'Otros', color: '#a0a09a' },
};

export const TIPO_EXP_LABELS: Record<string, string> = {
  TRABAJO: 'Trabajo',
  EDUCACION: 'Educación',
  CERTIFICACION: 'Certificación',
};

export const RUTAS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  BLOG: '/blog',
  SKILLS: '/skills',
  KANBAN: '/kanban',
  TERMINAL: '/terminal',
  CONTACT: '/contact',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  ABOUT: '/about',
  ADMIN_MENSAJES: '/admin/mensajes',
  ADMIN_CONTENIDO: '/admin/contenido',
  ADMIN_CV: '/admin/cv',
  ADMIN_USUARIOS: '/admin/usuarios',
} as const;

export const MENSAJES = {
  SESION_EXPIRADA: 'Sesión expirada. Inicia sesión nuevamente.',
  ERROR_SERVIDOR: 'Error de conexión con el servidor.',
  CAMBIOS_GUARDADOS: 'Cambios guardados correctamente.',
  ELIMINAR_CONFIRMACION: '¿Estás seguro de eliminar este elemento?',
  SIN_RESULTADOS: 'No se encontraron resultados.',
  CARGANDO: 'Cargando...',
} as const;

export const COLORES = {
  AMBER: '#f59e0b',
  GREEN: '#22c55e',
  RED: '#ef4444',
  BLUE: '#3b82f6',
  COMMENT: '#504f4a',
  SUBTLE: '#a0a09a',
  TEXT: '#f5f5f0',
  BORDER: '#2a2a2a',
  PANEL: '#111111',
  BLACK: '#0a0a0a',
} as const;
