import { EstadoType, PedidoType, ProductoType } from '@/types/types';
import { getCambiosResumen } from '../getCambiosResumen';
import { Timestamp } from 'firebase/firestore';

export const getUpdatedReservas = (
  pedidoID: string,
  arr: PedidoType[],
  newEstado: EstadoType,
  updatedPedido: PedidoType | null,
  sobrantes: ProductoType[],
  userID?: string
) => {
  const newReservas = arr.map((r) => {
    if (r.id === pedidoID) {
      const cambios = updatedPedido
        ? getCambiosResumen(r, updatedPedido, sobrantes)
        : null;
      return {
        ...(updatedPedido || r),
        movimientos: {
          ...r.movimientos,
          [newEstado]: {
            fecha: Timestamp.now(),
            admin: userID || '',
            cambios,
          },
        },
      };
    }
    return r;
  });
  return newReservas;
};
