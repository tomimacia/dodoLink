import { EstadoType, PedidoType } from '@/types/types';
import { Timestamp } from 'firebase/firestore';

export const getUpdatedCompras = (
  pedidoID: string,
  arr: PedidoType[],
  newEstado: EstadoType,
  updatedCompra: PedidoType | null,
  cambios: any[],
  userID?: string
) => {
  const newCompras = arr.map((r) => {
    if (r.id === pedidoID) {
      const baseCompra = updatedCompra || r;
      const now = Timestamp.now();
      const movimientosActualizados = {
        ...r.movimientos,
        'En curso': {
          fecha: r.movimientos['En curso']?.fecha || now,
          admin: userID || '',
          cambios: cambios,
        },
      };
      // Si el cambio es de Inicializado a Finalizado, agregamos también el estado "En curso"
      if (newEstado === 'Finalizado') {
        movimientosActualizados['Finalizado'] = {
          fecha: now,
          admin: userID || '',
          cambios: null,
        };
      }
      return {
        ...baseCompra,
        movimientos: movimientosActualizados,
      };
    }
    return r;
  });

  return newCompras;
};
