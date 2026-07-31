export function formatFecha(fecha: string | string[] | undefined): string {
  if (!fecha) return '';
  const f = Array.isArray(fecha) ? fecha[0] : fecha;
  const d = new Date(f);
  return d.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFechaISO(fecha: string): string {
  const d = new Date(fecha);
  return d.toISOString().split('T')[0];
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
