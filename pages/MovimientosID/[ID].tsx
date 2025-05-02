import MovimientoCard from '@/components/movimientos/MovimientosID/MovimientoCard';
import NotFoundPage from '@/components/NotFoundPage';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { IngresoType, MovimientosType } from '@/types/types';
type ServerSideProps = {
  params: {
    ID: string;
  };
  query: any;
};
export const getServerSideProps = async ({
  params,
  query,
}: ServerSideProps) => {
  const movimientos = (await getSingleDoc(
    'movimientos',
    params.ID
  )) as MovimientosType;
  if (!movimientos) {
    return {
      props: {
        movimiento: null,
      },
    };
  }
  const selectedTipoArr =
    query.tipo === 'Ingreso' ? movimientos.ingresos : movimientos.egresos;
  const selectedMov = selectedTipoArr.find(
    (i) => i?.fecha?.seconds === Number(query?.seconds)
  );
  if (!selectedMov) {
    return {
      props: {
        movimiento: null,
      },
    };
  }
  const formatIngreso = (i: IngresoType) => {
    const { cliente, fecha } = i ?? {};
    const { vencimiento, ingresoVencido } = cliente ?? {};
    return {
      ...i,
      fecha: {
        seconds: fecha?.seconds,
        nanoseconds: fecha?.nanoseconds,
      },
      cliente: cliente
        ? {
            ...cliente,
            vencimiento: {
              seconds: vencimiento?.seconds,
              nanoseconds: vencimiento?.nanoseconds,
            },
            ingresoVencido: ingresoVencido
              ? {
                  seconds: ingresoVencido?.seconds,
                  nanoseconds: ingresoVencido?.nanoseconds,
                }
              : null,
          }
        : null,
    };
  };
  return {
    props: {
      movimiento: formatIngreso(selectedMov as IngresoType),
    },
  };
};

const MovimientoID = ({ movimiento }: { movimiento: IngresoType | null }) => {
  if (!movimiento) return <NotFoundPage title='Movimiento no encontrado' />;
  return <MovimientoCard ingreso={movimiento} />;
};

export default MovimientoID;
