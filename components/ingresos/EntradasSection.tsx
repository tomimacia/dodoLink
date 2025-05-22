import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getEstado } from '@/helpers/cobros/getEstado';
import { PedidoType } from '@/types/types';
import { Flex, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import NoPedidosCard from './NoPedidosCard';
import PedidosRealTimeCard from './PedidosRealTimeCard';
const EntradasSection = ({
  grupo,
  title,
}: {
  grupo: PedidoType[];
  title: string;
}) => {
  const { user } = useUser();
  const filtered = grupo.filter((r) => {
    const estado = getEstado(r.movimientos);
    const hasReserva = r.movimientos?.['En curso'].admin === user?.id;
    return (
      CheckAdminRol(user?.rol) ||
      (estado === 'Pendiente' && !r.isRetiro) ||
      hasReserva
    );
  });
  const arrangeItems = (pedidos: PedidoType[]) => {
    return pedidos.sort((a, b) => {
      const estadoA = getEstado(a.movimientos);
      const estadoB = getEstado(b.movimientos);
      const lastSecondsA = a.movimientos[estadoA]?.fecha?.seconds || 0;
      const lastSecondsB = b.movimientos[estadoB]?.fecha?.seconds || 0;
      return lastSecondsB - lastSecondsA;
    });
  };
  const arrangedItems = arrangeItems(filtered);
  return (
    <Flex gap={2} flexDir='column'>
      <Heading as='h3' size='lg'>
        {title}
      </Heading>
      {filtered.length === 0 && <NoPedidosCard title={title.toLowerCase()} />}
      <Flex w='100%' flexWrap='wrap' gap={2}>
        <AnimatePresence>
          {filtered.length > 0 &&
            arrangedItems.map((r: PedidoType, index: number) => {
              return (
                <PedidosRealTimeCard
                  key={r.id + 'pedidoskey'}
                  pedido={r}
                  delay={index * 0.2}
                />
              );
            })}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default EntradasSection;
