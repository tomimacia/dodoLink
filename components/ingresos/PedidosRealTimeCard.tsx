import { PedidoType } from '@/types/types';
import { Badge, Button, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PedidoBody from './PedidoBody';
import { useThemeColors } from '@/hooks/useThemeColors';
const PedidosRealTimeCard = ({
  pedido,
  delay,
}: {
  pedido: PedidoType;
  delay: number;
}) => {
  const { brandColorLigth, brandColorDark } = useThemeColors();
  const { id } = pedido;
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        borderRadius: '1rem',
        width: '500px',
        maxWidth: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `1px solid #${pedido?.isRetiro ? 'BEBEBE' : 'E2E8F0'}`,
      }}
      initial={{ opacity: 0, x: 20 }}
      exit={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'tween', delay }}
    >
      <Flex justify='space-between' mb={2}>
        <Text fontSize='sm' color='gray.500' fontStyle='italic'>
          ID: {id}
        </Text>
        {pedido?.isRetiro && (
          <Badge alignContent='center' borderRadius={3}>
            Retiro
          </Badge>
        )}
      </Flex>

      <PedidoBody pedido={pedido} />

      <Flex mt='auto' pt={4} justify='flex-end'>
        <Button
          as={Link}
          href={`/PedidosID/${id}`}
          bg={brandColorLigth}
          color={brandColorDark}
          size='sm'
          borderRadius='md'
          _hover={{ bg: 'gray.600' }}
          transition='all 0.2s'
        >
          Ver Pedido
        </Button>
      </Flex>
    </motion.div>
  );
};

export default PedidosRealTimeCard;
