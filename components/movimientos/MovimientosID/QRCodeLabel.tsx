import dateTexto from '@/helpers/dateTexto';
import { PedidoType } from '@/types/types';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeLabel = ({ pedido }: { pedido: PedidoType }) => {
  const { id, cliente, detalle, items, fecha } = pedido;

  return (
    <Flex
      direction='column'
      boxShadow='0 0 3px'
      borderRadius={5}
      p={4}
      w='300px'
      fontSize='sm'
      bg='white'
    >
      <Heading fontWeight='normal' as='h4' size='md' mb={2}>
        Para: <b>{cliente}</b>
      </Heading>
      <Text fontWeight='bold'>ID: {id}</Text>

      <Text mb={2}>
        Fecha: {dateTexto(fecha.seconds).numDate} -{' '}
        {dateTexto(fecha.seconds, true).hourDate} HS
      </Text>

      {detalle && (
        <Text mb={2} fontStyle='italic'>
          {detalle}
        </Text>
      )}

      <Box borderTop='1px solid gray' my={2} pt={2}>
        <Text fontWeight='bold'>Materiales:</Text>
        <VStack align='start' spacing={1}>
          {items.map((item, idx) => (
            <Text key={idx}>
              - {item.nombre} x {item.unidades}
            </Text>
          ))}
        </VStack>
      </Box>

      <Flex justify='center' mt={4}>
        <QRCode value={id} size={125} />
      </Flex>
    </Flex>
  );
};

export default QRCodeLabel;
