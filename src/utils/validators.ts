export interface ValidationResult {
  valido: boolean;
  error?: string;
}

export function validarRequerido(value: string, campo: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valido: false, error: `${campo} es requerido` };
  }
  return { valido: true };
}

export function validarEmail(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valido: false, error: 'El correo es requerido' };
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) {
    return { valido: false, error: 'Formato de correo inválido' };
  }
  return { valido: true };
}

export function validarLongitudMin(value: string, min: number, campo: string): ValidationResult {
  if (!value || value.trim().length < min) {
    return { valido: false, error: `${campo} debe tener al menos ${min} caracteres` };
  }
  return { valido: true };
}

export function validarLongitudMax(value: string, max: number, campo: string): ValidationResult {
  if (value && value.length > max) {
    return { valido: false, error: `${campo} debe tener máximo ${max} caracteres` };
  }
  return { valido: true };
}

export function validarRango(num: number, min: number, max: number, campo: string): ValidationResult {
  if (num < min || num > max) {
    return { valido: false, error: `${campo} debe estar entre ${min} y ${max}` };
  }
  return { valido: true };
}

export function validarUrl(value: string): ValidationResult {
  if (!value) return { valido: true };
  try {
    new URL(value);
    return { valido: true };
  } catch {
    return { valido: false, error: 'URL inválida' };
  }
}

export function validarClave(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valido: false, error: 'La contraseña es requerida' };
  }
  if (value.length < 6) {
    return { valido: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (!/[A-Z]/.test(value)) {
    return { valido: false, error: 'La contraseña debe tener al menos una mayúscula' };
  }
  if (!/[0-9]/.test(value)) {
    return { valido: false, error: 'La contraseña debe tener al menos un número' };
  }
  return { valido: true };
}

export function validarConfirmacionClave(clave: string, confirmacion: string): ValidationResult {
  if (clave !== confirmacion) {
    return { valido: false, error: 'Las contraseñas no coinciden' };
  }
  return { valido: true };
}

export function validarFormulario<T extends Record<string, unknown>>(
  data: T,
  reglas: Record<keyof T, () => ValidationResult>
): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const campo of Object.keys(reglas) as (keyof T)[]) {
    const result = reglas[campo]();
    if (!result.valido && result.error) {
      errores[campo as string] = result.error;
    }
  }
  return errores;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^https?:\/\/.+/;
export const SLUG_REGEX = /^[a-z0-9-]+$/;
export const ALPHA_REGEX = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;
export const NUMERIC_REGEX = /^\d+$/;
