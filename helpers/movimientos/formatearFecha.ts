export function formatearFecha(id: string) {
  const fecha = id.split('-')[0];
  const str = fecha.toString();
  const dia = str.slice(0, 2);
  const mes = str.slice(2, 4);
  const anio = str.slice(4, 8);
  return `${dia}-${mes}-${anio}`;
}
