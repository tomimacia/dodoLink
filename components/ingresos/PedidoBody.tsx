import { getEstado } from '@/helpers/cobros/getEstado';
import { EstadoColors, Estados, PedidoType } from '@/types/types';
import { Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
const PedidoBody = ({
  pedido,
  loading,
  size,
}: {
  pedido: PedidoType;
  loading?: boolean;
  size: 'inicio' | 'consulta';
}) => {
  const { cliente, detalle, movimientos } = pedido ?? {};
  const estado = getEstado(movimientos);
  const prevColor =
    EstadoColors[Estados[Estados.indexOf(estado) - 1]] ?? 'gray';
  return (
    <Flex flexDir='column' gap={2}>
      <motion.div
        key={EstadoColors[estado]}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'white',
          backgroundColor: EstadoColors[estado],
          width: 'fit-content',
        }}
        initial={{ backgroundColor: prevColor }}
        animate={{ backgroundColor: EstadoColors[estado] }}
        transition={{ duration: 1 }}
      >
        Estado: {estado}
      </motion.div>

      <Heading
        title={cliente}
        noOfLines={1}
        cursor='default'
        as='h2'
        fontSize='xl'
        fontWeight='semibold'
      >
        {cliente}
      </Heading>

      <Text cursor='default' title={detalle} noOfLines={1} py={1} fontSize='md'>
        {detalle}
      </Text>
    </Flex>
  );
};

export default PedidoBody;
