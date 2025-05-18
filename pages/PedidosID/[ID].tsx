import MovimientoCardCompra from '@/components/movimientos/MovimientosID/MovimientoCardCompra';
import MovimientoCardReserva from '@/components/movimientos/MovimientosID/MovimientoCardReserva';
import NotFoundPage from '@/components/NotFoundPage';
import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { getEstado } from '@/helpers/cobros/getEstado';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import { formatIngreso } from '@/helpers/movimientos/formatIngreso';
import { MovimientosType, PedidoType } from '@/types/types';
import { useEffect } from 'react';
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
  const { reservas, compras } = useOnCurso();
  useEffect(() => {
    const marcarComoVisto = async () => {
      if (!movimiento || !user) return;

      const selectedPedidos = movimiento?.isPago ? compras : reservas;
      const field = movimiento?.isPago ? 'compras' : 'reservas';
      const actual = selectedPedidos?.find((p) => p.id === movimiento.id);
      if (!actual || !selectedPedidos) return;
      const yaVisto = actual.vistoPor?.includes(user.id);
      const puedeVer =
        getEstado(actual.movimientos) === 'Pendiente' ||
        CheckAdminRol(user.rol);

      if (!yaVisto && puedeVer) {
        const actualizar = (arr: PedidoType[]) =>
          arr.map((p) =>
            p.id === actual.id
              ? { ...p, vistoPor: [...(p.vistoPor || []), user.id] }
              : p
          );

        const actualizado = {
          [field]: actualizar(selectedPedidos || []),
        };

        await setSingleDoc('movimientos', 'enCurso', actualizado);
      }
    };

    marcarComoVisto();
  }, [movimiento, user]);
  if (!movimiento)
    return (
      <NotFoundPage
        content='El movimiento que buscás no existe o fue eliminado.'
        title='Movimiento no encontrado'
      />
    );
  if (movimiento.isPago)
    return <MovimientoCardCompra movimiento={movimiento} />;

  return <MovimientoCardReserva movimiento={movimiento} />;
};

export default MovimientoID;
