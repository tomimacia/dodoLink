import { EstadoColors, PedidoType } from '@/types/types';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUserAlt, FaReceipt } from 'react-icons/fa';
import { BsCalendar, BsClockHistory } from 'react-icons/bs';
import { getEstado } from '@/helpers/cobros/getEstado';
import dateTexto from '@/helpers/dateTexto';
import { useRouter } from 'next/router';

const MotionBox = motion(Box);

const PedidoCard = ({
  pedido,
  isList,
}: {
  pedido: PedidoType;
  isList: boolean;
  deleteClienteFront: (id: string) => void;
}) => {
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderCard = useColorModeValue('gray.200', 'gray.600');
  const estado = getEstado(pedido.movimientos);
  const { push } = useRouter();
  const pushPedido = () => {
    push(`/PedidosID/${pedido.id}`);
  };
  return (
    <MotionBox
      bg={bgCard}
      borderWidth={1}
      borderColor={borderCard}
      rounded='lg'
      p={4}
      w={isList ? '100%' : { base: '100%', sm: '45%', md: '30%', lg: '22%' }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      _hover={{ boxShadow: '0 0 3px' }}
      boxShadow='sm'
      cursor='pointer'
      minW='210px'
      onClick={pushPedido}
    >
      <Flex direction='column' gap={2}>
        <Flex align='center' gap={2}>
          <FaUserAlt />
          <Text
            title={pedido.cliente}
            noOfLines={1}
            fontWeight='bold'
            fontSize='lg'
          >
            {pedido.cliente}
          </Text>
        </Flex>

        <Flex
          align='center'
          gap={2}
          fontSize='sm'
          color='gray.600'
          _dark={{ color: 'gray.300' }}
        >
          {isList && <FaReceipt />}
          <Text>ID: {pedido.id}</Text>
        </Flex>

        <Flex
          align='center'
          gap={2}
          fontSize='sm'
          color='gray.600'
          _dark={{ color: 'gray.300' }}
        >
          <BsCalendar />
          <Text>
            Fecha:{' '}
            {dateTexto(pedido?.movimientos?.Inicializado.fecha.seconds)
              .numDate || 'N/D'}
          </Text>
        </Flex>
        <Flex
          align='center'
          gap={2}
          fontSize='sm'
          color='gray.600'
          _dark={{ color: 'gray.300' }}
        >
          <BsClockHistory />
          <Text>
            Hora:{' '}
            {dateTexto(pedido?.movimientos?.Inicializado.fecha.seconds)
              .hourDate || 'N/D'}
          </Text>
        </Flex>

        {estado && (
          <Text
            fontSize='sm'
            mt={2}
            px={2}
            py={1}
            w='fit-content'
            rounded='md'
            bg={EstadoColors[estado]}
            color='gray.50'
          >
            Estado: {estado}
          </Text>
        )}
      </Flex>
    </MotionBox>
  );
};

export default PedidoCard;
