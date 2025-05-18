import dateTexto from '@/helpers/dateTexto';
import { EstadoType, PedidoFechaParcial, ProductoType } from '@/types/types';
import {
  Box,
  Flex,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';

const HistorialCambiosEnCurso = ({
  estado,
  movimiento,
  isPago,
}: {
  estado: EstadoType;
  movimiento: PedidoFechaParcial;
  isPago: boolean;
}) => {
  if (!movimiento?.cambios) return <></>;

  if (estado === 'En curso' || (estado === 'Finalizado' && isPago)) {
    return (
      <VStack spacing={3} align='stretch'>
        {movimiento.cambios.map((cambio, index) => {
          if (!cambio || typeof cambio === 'string') {
            return (
              <Box
                key={'cambios-key' + index}
                bg='gray.50'
                p={3}
                borderRadius='md'
                border='1px solid'
                borderColor='gray.200'
              >
                <Text fontSize='sm' color='gray.600'>
                  Compra recibida en una sola entrega
                </Text>
              </Box>
            );
          }

          const { user, items, date } = cambio;
          return (
            <Box
              key={'cambios-key' + index}
              bg='gray.50'
              p={2}
              borderRadius='lg'
              border='1px solid'
              borderColor='gray.200'
              shadow='sm'
            >
              <Flex justify='space-between' mb={1}>
                <Text fontSize='sm' color='gray.500'>
                  {user.nombre} {user.apellido}
                </Text>
                <Text fontSize='sm' color='gray.500'>
                  {dateTexto(date.seconds, true).numDate} ·{' '}
                  {dateTexto(date.seconds).hourDate} hs
                </Text>
              </Flex>

              <Text fontSize='sm' color='gray.700' mb={1}>
                Productos recibidos:
              </Text>
              <UnorderedList spacing={1} pl={4}>
                {items.map((item: ProductoType) => (
                  <ListItem
                    key={'list-key-' + index + '-' + item.nombre}
                    fontSize='sm'
                    color='gray.700'
                  >
                    {item.nombre}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          );
        })}
      </VStack>
    );
  }

  return (
    <UnorderedList spacing={2} pl={4}>
      {movimiento.cambios.map((cambio, index) => (
        <ListItem key={index} fontSize='sm'>
          {typeof cambio === 'string' ? cambio : ''}
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default HistorialCambiosEnCurso;
