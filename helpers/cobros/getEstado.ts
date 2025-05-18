import { Estados, EstadoType, PedidoFechaType } from '@/types/types';

export const getEstado = (movimientos: PedidoFechaType): EstadoType => {
  const ultimoIndice = Estados.findLastIndex(
    (estado) => movimientos[estado]?.fecha !== null
  );

  // Como Inicializado siempre tiene fecha, podemos asumir que ultimoIndice nunca es -1
  return Estados[ultimoIndice];
};