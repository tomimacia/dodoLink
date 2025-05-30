import { getEstado } from '@/helpers/cobros/getEstado';
import {
  EstadoColors,
  Estados,
  EstadosCompra,
  PedidoType,
} from '@/types/types';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Fragment, useEffect, useRef } from 'react';
const PedidoBody = ({ pedido }: { pedido: PedidoType }) => {
  const { cliente, detalle, movimientos } = pedido ?? {};
  const estado = getEstado(movimientos);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);
  const EstadosSelected = pedido.isPago ? EstadosCompra : Estados;
  const prevColor =
    EstadoColors[EstadosSelected[EstadosSelected.indexOf(estado) - 1]] ??
    'gray';
  return (
    <Flex flexDir='column' gap={2}>
      <motion.div
        key={EstadoColors[estado]}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '50px',
          padding: '4px 12px',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'white',
          backgroundColor: EstadoColors[estado],
          width: 'fit-content',
          gap: 4,
        }}
        initial={{ backgroundColor: prevColor }}
        animate={{ backgroundColor: EstadoColors[estado] }}
        transition={hasMounted.current ? { duration: 1 } : { duration: 0 }}
      >
        Estado: <b>{estado}</b>
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

      <Text
        cursor='default'
        title={detalle.join('\n')}
        // title={detalle}
        noOfLines={1}
        py={1}
        fontSize='md'
      >
        {detalle?.map((l) => {
          return (
            <Fragment key={`${l}-detalle-${pedido.id}}`}>
              <span>{l}</span>
              <br />
            </Fragment>
          );
        })}
      </Text>
    </Flex>
  );
};

export default PedidoBody;
