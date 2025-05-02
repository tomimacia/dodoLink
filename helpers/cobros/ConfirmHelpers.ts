import { Timestamp } from 'firebase/firestore';
import { dateSeconds } from './dateFromSeconds';
import { addMonths } from 'date-fns';

const cantDeDiasRange = 1;
export const estaDentroDe24Horas = (vencimientoSeconds: number) => {
  const ahoraSeconds = Timestamp.now().seconds; // Timestamp actual en milisegundos
  const diferencia = Math.abs(ahoraSeconds - vencimientoSeconds); // Diferencia en milisegundos
  return diferencia <= 86400 * cantDeDiasRange;
};
export const getVencidoDate = (
  vencimiento: any,
  ingresoVencido: any,
  cantDeMeses: number
) => {
  const dentroDe245hs = estaDentroDe24Horas(vencimiento?.seconds || 0);
  if (dentroDe245hs)
    return addMonths(dateSeconds(vencimiento?.seconds), cantDeMeses);
  if (ingresoVencido)
    return addMonths(dateSeconds(ingresoVencido?.seconds), cantDeMeses);
  return addMonths(new Date(), cantDeMeses);
};
