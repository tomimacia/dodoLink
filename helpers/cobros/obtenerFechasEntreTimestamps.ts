import { eachDayOfInterval, format } from 'date-fns';

export const obtenerFechasEntreTimestamps = (inicio: number, end?: number) => {
  return eachDayOfInterval({
    start: new Date(inicio * 1000),
    end: new Date((end ?? Math.floor(Date.now() / 1000)) * 1000), // Usa `end` si está definido, sino usa la fecha actual.
  }).map((fecha) => format(fecha, 'dd-MM-yyyy'));
};
