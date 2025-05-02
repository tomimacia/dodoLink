import { addDots } from '@/helpers/addDots';
import { ClientType } from '@/types/types';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

const ClientesCtaCte = ({
  clientes,
  handleOpenModal,
}: {
  clientes: ClientType[];
  handleOpenModal: (title: string, list: any) => void;
}) => {
  const ctaCteFavor = clientes.filter((c) => c.saldo > 0);
  const ctaCteContra = clientes.filter((c) => c.saldo < 0);
  const totalCtaCte = clientes.reduce((acc, c) => {
    if (!c || !c?.saldo) return acc;
    return acc + c.saldo;
  }, 0);
  return (
    <Flex boxShadow='0 0 5px' borderRadius={10} p={1} gap={2} flexDir='column'>
      <Flex flexDir='column' p={1}>
        <Text fontSize='xl'>Estado Cta Cte</Text>
        <Text fontStyle='italic'>Neto: ${addDots(totalCtaCte)}</Text>
      </Flex>
      <Flex maxW='400px' gap={1} flexDir='column' p={1}>
        <Flex
          bg={ctaCteFavor.length ? 'green.800' : 'blue.800'}
          _hover={{ opacity: 0.9 }}
          color='white'
          p={1}
          borderRadius={5}
          cursor='pointer'
          gap={1}
          justify='space-between'
          onClick={() => handleOpenModal('Saldo Positivo', ctaCteFavor)}
        >
          <Text>Clientes Saldo Positivo</Text>
          <Text fontWeight='bold'> {ctaCteFavor.length}</Text>
        </Flex>
        <Flex
          bg={ctaCteContra.length > 0 ? 'red.800' : 'blue.800'}
          _hover={{ opacity: 0.9 }}
          color='white'
          p={1}
          borderRadius={5}
          cursor='pointer'
          gap={1}
          justify='space-between'
          onClick={() => handleOpenModal('Saldo Negativo', ctaCteContra)}
        >
          <Text>Clientes Saldo Negativo</Text>
          <Text fontWeight='bold'> {ctaCteContra.length}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ClientesCtaCte;
