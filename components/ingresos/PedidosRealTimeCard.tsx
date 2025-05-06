import { PedidoType } from '@/types/types';
import { Button, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PedidoBody from './PedidoBody';
const PedidosRealTimeCard = ({
  pedido,
  loading,
  delay,
}: {
  pedido: PedidoType;
  loading: boolean;
  delay: number;
}) => {
  const { id } = pedido;
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid gray',
        padding: 8,
        borderRadius: 20,
        width: '500px',
        maxWidth: '100%',
      }}
      initial={{ opacity: 0, x: 150 }}
      exit={{ opacity: 0, x: -150 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'tween', delay }}
    >
      <Flex justify='space-between'>
        <Text fontSize={14} fontStyle='italic'>
          ID: {id}
        </Text>
      </Flex>
      <PedidoBody size='inicio' pedido={pedido} loading={loading} />
      <Flex gap={2}>
        <Button
          as={Link}
          href={`/PedidosID/${id}`}
          target='_blank'
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
        >
          Ver Pedido
        </Button>
      </Flex>
    </motion.div>
  );
};

export default PedidosRealTimeCard;
