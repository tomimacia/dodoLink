import MovimientoCard from '@/components/movimientos/MovimientosID/MovimientoCard';
import NotAuthorized from '@/components/Navigation/NotAuthorized';
import NotFoundPage from '@/components/NotFoundPage';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
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
    const { fecha } = i ?? {};
    return {
      ...i,
      fecha: {
        seconds: fecha?.seconds,
        nanoseconds: fecha?.nanoseconds,
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
  if (!CheckAdminRol(user?.rol) && movimiento.estado !== 'Pendiente')
    return <NotAuthorized />;
  return <MovimientoCard movimiento={movimiento} />;
};

export default MovimientoID;
