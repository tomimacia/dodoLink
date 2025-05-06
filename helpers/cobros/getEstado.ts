import { Estados, PedidoFechaType } from '@/types/types';

export const getEstado = (movimientos: PedidoFechaType) => {
  const { Inicializado, Preparación, Pendiente, Finalizado } = movimientos;
  const EnCurso = movimientos['En curso'];
  const estados = [Inicializado, Preparación, Pendiente, EnCurso, Finalizado];
  if (estados.every((estado) => estado?.fecha !== null)) return 'Finalizado';
  return Estados[estados.findIndex((estado) => !estado?.fecha) - 1];
};
