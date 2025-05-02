import { EstadoType } from '@/types/types';
import { isInhabilitado } from './isInhabilitado';

export const getEstado = (c: any | null) => {
  if (c?.activo === false) return 'Inactivo';
  const vencimientoSeconds = c?.vencimiento?.seconds;
  const paramSeconds = c?.horarioIngreso
    ? c?.horarioIngreso?.seconds
    : new Date().getTime() / 1000;
  const venc = vencimientoSeconds;
  const inhabilitado = isInhabilitado(c);
  const estado: EstadoType = inhabilitado
    ? 'Pendiente'
    : venc > paramSeconds
    ? 'Inicializado'
    : 'En curso';
  return estado;
};
