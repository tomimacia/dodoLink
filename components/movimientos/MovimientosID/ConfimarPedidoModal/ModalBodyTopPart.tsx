import { Estados, EstadoType } from '@/types/types';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const ModalBodyTopPart = ({ estado }: { estado: EstadoType }) => {
  const nextEstado = Estados[Estados.indexOf(estado) + 1];
  const firstText = {
    Inicializado: 'Revisá que los datos estén correctos antes de confirmar.',
    Preparación: 'Corroborá que los productos estén listos para el envío.',
    Pendiente: 'Retirá los productos en la sucursal.',
    'En curso':
      'Indicá si hubo sobrantes de material, y confirmá para finalizar.',
    Finalizado: '',
  };
  const nextEstadoColor = useColorModeValue('blue.600', 'blue.300');
  return (
    <Flex mb='3' flexDir='column' gap={1}>
      <Text fontWeight='medium'>
        {estado === 'En curso'
          ? ' ¿Finalizar pedido?'
          : ' ¿Querés continuar con la actualización del pedido?'}
      </Text>
      <Text>{firstText[estado]}</Text>
      <Flex flexDir='column' mt={2} gap={1}>
        <Text>
          <b>Estado actual:</b> {estado}
        </Text>
        <Text>
          <b>Actualizar a:</b>{' '}
          <Text as='span' fontWeight='bold' color={nextEstadoColor}>
            {nextEstado}
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
};

export default ModalBodyTopPart;
