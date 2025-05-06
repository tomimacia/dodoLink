import { PedidoType } from '@/types/types';

export const formatIngreso = (i: PedidoType) => {
  const { movimientos } = i ?? {};
  const { Inicializado, Preparación, Pendiente, Finalizado } =
    movimientos ?? {};
  const EnCurso = movimientos['En curso'];
  return {
    ...i,
    movimientos: {
      Inicializado: Inicializado?.fecha
        ? {
            fecha: {
              seconds: Inicializado?.fecha?.seconds,
              nanoseconds: Inicializado?.fecha?.nanoseconds,
            },
            admin: Inicializado?.admin,
          }
        : {
            fecha: null,
            admin: null,
          },
      Preparación: Preparación?.fecha
        ? {
            fecha: {
              seconds: Preparación?.fecha?.seconds,
              nanoseconds: Preparación?.fecha?.nanoseconds,
            },
            admin: Preparación?.admin,
          }
        : {
            fecha: null,
            admin: null,
          },
      Pendiente: Pendiente?.fecha
        ? {
            fecha: {
              seconds: Pendiente?.fecha?.seconds,
              nanoseconds: Pendiente?.fecha?.nanoseconds,
            },
            admin: Pendiente?.admin,
          }
        : {
            fecha: null,
            admin: null,
          },
      'En curso': EnCurso?.fecha
        ? {
            fecha: {
              seconds: EnCurso?.fecha?.seconds,
              nanoseconds: EnCurso?.fecha?.nanoseconds,
            },
            admin: EnCurso?.admin,
          }
        : {
            fecha: null,
            admin: null,
          },
      Finalizado: Finalizado?.fecha
        ? {
            fecha: {
              seconds: Finalizado?.fecha?.seconds,
              nanoseconds: Finalizado?.fecha?.nanoseconds,
            },
            admin: Finalizado?.admin,
          }
        : {
            fecha: null,
            admin: null,
          },
    },
  };
};
