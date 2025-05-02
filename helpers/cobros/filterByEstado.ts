import { ClientType, EstadoType } from '@/types/types';
import { getEstado } from './getEstado';

export const clientesFilteredByEstado = (
  estado: EstadoType,
  clientes: ClientType[]
) => {
  return clientes.filter((c) => {
    const thisEstado = getEstado(c);
    return thisEstado === estado;
  });
};
