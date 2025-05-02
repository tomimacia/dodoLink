import { PedidoType } from '@/types/types';
import { Flex, Heading } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import PedidosRealTimeCard from './PedidosRealTimeCard';
const EntradasSection = ({
  grupo,
  loading,
  title,
}: {
  grupo: PedidoType[];
  loading: boolean;
  title: string;
}) => {
  if (grupo.length === 0) return <></>
  return (
    <Flex flexDir='column'>
      <Heading as='h3' size='lg'>
        {title}
      </Heading>
      <Flex w='100%' flexWrap='wrap' gap={2}>
        <AnimatePresence>
          {grupo.length > 0 &&
            grupo.map((r: PedidoType, index: number) => {
              return (
                <PedidosRealTimeCard
                  key={r.id + 'pedidoskey'}
                  loading={loading}
                  pedido={r}
                  data={grupo}
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
