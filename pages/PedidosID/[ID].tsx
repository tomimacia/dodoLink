import MovimientoCard from '@/components/movimientos/MovimientosID/MovimientoCard';
import NotAuthorized from '@/components/Navigation/NotAuthorized';
import NotFoundPage from '@/components/NotFoundPage';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { getEstado } from '@/helpers/cobros/getEstado';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import { MovimientosType, PedidoType } from '@/types/types';
type ServerSideProps = {
  params: {
    ID: string;
  };
};
export const getServerSideProps = async ({ params }: ServerSideProps) => {
  const docID = formatearFecha(params.ID);
  const movimientos = (await getSingleDoc(
    'movimientos',
    docID
  )) as MovimientosType;
  if (!movimientos) {
    return {
      props: {
        movimiento: null,
      },
    };
  }
  const pedidos = [...movimientos.reservas, ...movimientos.compras];
  const selectedMov = pedidos.find((i) => i?.id === params?.ID) as
    | PedidoType
    | undefined;
  if (!selectedMov) {
    return {
      props: {
        movimiento: null,
      },
    };
  }
  const formatIngreso = (i: PedidoType) => {
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
          : null,
        Preparación: Preparación?.fecha
          ? {
              fecha: {
                seconds: Preparación?.fecha?.seconds,
                nanoseconds: Preparación?.fecha?.nanoseconds,
              },
              admin: Preparación?.admin,
            }
          : null,
        Pendiente: Pendiente?.fecha
          ? {
              fecha: {
                seconds: Pendiente?.fecha?.seconds,
                nanoseconds: Pendiente?.fecha?.nanoseconds,
              },
              admin: Pendiente?.admin,
            }
          : null,
        'En curso': EnCurso?.fecha
          ? {
              fecha: {
                seconds: EnCurso?.fecha?.seconds,
                nanoseconds: EnCurso?.fecha?.nanoseconds,
              },
              admin: EnCurso?.admin,
            }
          : null,
        Finalizado: Finalizado?.fecha
          ? {
              fecha: {
                seconds: Finalizado?.fecha?.seconds,
                nanoseconds: Finalizado?.fecha?.nanoseconds,
              },
              admin: Finalizado?.admin,
            }
          : null,
      },
    };
  };
  return {
    props: {
      movimiento: formatIngreso(selectedMov as PedidoType),
    },
  };
};

const MovimientoID = ({ movimiento }: { movimiento: PedidoType | null }) => {
  const { user } = useUser();
  if (!movimiento) return <NotFoundPage title='Movimiento no encontrado' />;
  const estado = getEstado(movimiento?.movimientos);
  if (!CheckAdminRol(user?.rol) && estado !== 'Pendiente')
    return <NotAuthorized />;
  return <MovimientoCard movimiento={movimiento} />;
};

export default MovimientoID;
