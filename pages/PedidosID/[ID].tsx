import MovimientoCard from '@/components/movimientos/MovimientosID/MovimientoCard';
import NotFoundPage from '@/components/NotFoundPage';
import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import { formatIngreso } from '@/helpers/movimientos/formatIngreso';
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
  return {
    props: {
      movimiento: formatIngreso(selectedMov as PedidoType),
    },
  };
};

const MovimientoID = ({ movimiento }: { movimiento: PedidoType | null }) => {
  const { user } = useUser();
  if (!movimiento)
    return (
      <NotFoundPage
        content='El movimiento que buscás no existe o fue eliminado.'
        title='Movimiento no encontrado'
      />
    );
  return <MovimientoCard movimiento={movimiento} />;
};

export default MovimientoID;
