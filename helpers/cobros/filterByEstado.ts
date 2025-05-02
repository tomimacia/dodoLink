import { EstadoType } from '@/types/types';
import { getEstado } from './getEstado';
// A arreglar
export const clientesFilteredByEstado = (
  estado: EstadoType,
  pedidos: any[]
) => {
  return pedidos.filter((c) => {
    const thisEstado = getEstado(c);
    return thisEstado === estado;
  });
};
