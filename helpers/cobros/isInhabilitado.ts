import { DiasParaInhabilitacion } from '@/data/data';

export const isInhabilitado = (c: any | null): boolean => {
  const ahora = c?.horarioIngreso
    ? c?.horarioIngreso?.seconds
    : new Date().getTime() / 1000;
  const ingresoVencidoSeconds = c?.ingresoVencido?.seconds;
  const diezDiasEnSegundos = DiasParaInhabilitacion * 24 * 60 * 60; // 10 días en segundos
  return ahora - ingresoVencidoSeconds >= diezDiasEnSegundos;
};
