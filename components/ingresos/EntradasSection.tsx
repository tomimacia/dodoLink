import { PedidoType } from '@/types/types';
import { Flex, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import PedidosRealTimeCard from './PedidosRealTimeCard';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import NoPedidosCard from './NoPedidosCard';
import QrScanner from '../inicio/QrScanner';
import capitalizeFirst from '@/helpers/capitalizeFirst';
import { getEstado } from '@/helpers/cobros/getEstado';
const EntradasSection = ({
  grupo,
  loading,
  title,
}: {
  grupo: PedidoType[];
  loading: boolean;
  title: string;
}) => {
  const { user } = useUser();
  const filtered = grupo.filter((r) => {
    const estado = getEstado(r.movimientos);
    return estado === 'Pendiente' || CheckAdminRol(user?.rol);
  });
  const getRoute = (route: string) => {
    if (title === 'Reservas') return `/PedidosID/${route}`;
    return `/ComprasID/${route}`;
  };
  return (
    <Flex gap={2} flexDir='column'>
      <Heading as='h3' size='lg'>
        {title}
      </Heading>
      <QrScanner
        title={`Escanear Código de ${capitalizeFirst(title.slice(0, -1))}`}
        getRoute={getRoute}
      />
      {filtered.length === 0 && <NoPedidosCard title={title.toLowerCase()} />}
      <Flex w='100%' flexWrap='wrap' gap={2}>
        <AnimatePresence>
          {filtered.length > 0 &&
            filtered.map((r: PedidoType, index: number) => {
              return (
                <PedidosRealTimeCard
                  key={r.id + 'pedidoskey'}
                  loading={loading}
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
