import { PedidoType, MovCambioObject } from '@/types/types';

export const formatIngreso = (i: PedidoType): PedidoType => {
  const movimientos = i?.movimientos ?? {};

  const parseFecha = (
    fecha: any
  ): { seconds: number; nanoseconds: number } | null =>
    fecha?.seconds !== undefined && fecha?.nanoseconds !== undefined
      ? { seconds: fecha.seconds, nanoseconds: fecha.nanoseconds }
      : null;

  const parseCambios = (cambios?: any): MovCambioObject[] | string[] | null => {
    if (!cambios) return null;

    // Si es un array de strings (["algo", "otro"]), lo devolvemos tal cual
    if (typeof cambios[0] === 'string') return cambios as string[];

    // Si es un array de objetos, convertimos los Timestamp a serializables
    return (cambios as MovCambioObject[]).map((cambio) => ({
      ...cambio,
      date: parseFecha((cambio as MovCambioObject).date) || {
        seconds: 0,
        nanoseconds: 0,
      },
    }));
  };

  return {
    ...i,
    movimientos: {
      Inicializado: {
        fecha: parseFecha(movimientos.Inicializado?.fecha) ?? {
          seconds: 0,
          nanoseconds: 0,
        },
        admin: movimientos.Inicializado?.admin ?? '',
        cambios: parseCambios(movimientos.Inicializado?.cambios) || null,
      },
      Preparación: {
        fecha: parseFecha(movimientos.Preparación?.fecha),
        admin: movimientos.Preparación?.admin ?? null,
        cambios: parseCambios(movimientos.Preparación?.cambios) || null,
      },
      Pendiente: {
        fecha: parseFecha(movimientos.Pendiente?.fecha),
        admin: movimientos.Pendiente?.admin ?? null,
        cambios: parseCambios(movimientos.Pendiente?.cambios) || null,
      },
      'En curso': {
        fecha: parseFecha(movimientos['En curso']?.fecha),
        admin: movimientos['En curso']?.admin ?? null,
        cambios: parseCambios(movimientos['En curso']?.cambios) || null,
      },
      Finalizado: {
        fecha: parseFecha(movimientos.Finalizado?.fecha),
        admin: movimientos.Finalizado?.admin ?? null,
        cambios: parseCambios(movimientos.Finalizado?.cambios) || null,
      },
    },
  };
};
