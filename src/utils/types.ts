export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'USER';
  activo: boolean;
  creadoEn: string;
}

export interface Proyecto {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  contenido: string;
  categoria: string;
  destacado: boolean;
  repoUrl: string;
  demoUrl: string;
  portadaUrl: string;
  tecnologias: Tecnologia[];
  creadoEn: string;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  color: string;
  icono: string;
}

export interface Post {
  id: number;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  portadaUrl: string;
  estado: 'BORRADOR' | 'PUBLICADO';
  publicadoEn: string;
  tiempoLectura: number;
  vistas: number;
  categoria: Categoria;
  tags: Tag[];
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  color: string;
}

export interface Tag {
  id: number;
  nombre: string;
  slug: string;
}

export interface Skill {
  id: number;
  nombre: string;
  categoria: 'FRONTEND' | 'BACKEND' | 'BASE_DATOS' | 'DEVOPS' | 'OTRO';
  nivel: number;
}

export interface Experiencia {
  id: number;
  empresa: string;
  puesto: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: 'TRABAJO' | 'EDUCACION' | 'CERTIFICACION';
  url: string;
}

export interface Mensaje {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  recibidoEn: string;
}

export interface Board {
  id: number;
  nombre: string;
  descripcion: string;
  columnas: Columna[];
}

export interface Columna {
  id: number;
  titulo: string;
  orden: number;
  cards: Card[];
}

export interface Card {
  id: number;
  titulo: string;
  descripcion: string;
  etiqueta: 'NINGUNA' | 'ROJO' | 'VERDE' | 'AMBAR' | 'AZUL';
  fechaLimite: string;
  orden: number;
}

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface LoginResponse {
  id: number;
  correo: string;
  rol: string;
  referenciaId: number;
  token: string;
}

export interface ContactRequest {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

export interface DashboardStats {
  proyectos: number;
  posts: number;
  skills: number;
  mensajes: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type CategoriaProyecto = 'WEB' | 'MOBILE' | 'CLI' | 'API' | 'OTHER';
export type CategoriaSkill = 'FRONTEND' | 'BACKEND' | 'BASE_DATOS' | 'DEVOPS' | 'OTRO';
export type TipoExperiencia = 'TRABAJO' | 'EDUCACION' | 'CERTIFICACION';
export type EstadoPost = 'BORRADOR' | 'PUBLICADO';
export type EtiquetaCard = 'NINGUNA' | 'ROJO' | 'VERDE' | 'AMBAR' | 'AZUL';
export type RolUsuario = 'ADMIN' | 'USER';
