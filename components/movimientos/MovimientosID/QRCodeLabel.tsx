import React, { useRef } from 'react';
import dateTexto from '@/helpers/dateTexto';
import { PedidoType } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { IoMdPrint } from 'react-icons/io';
import { getEstado } from '@/helpers/cobros/getEstado';
const QRCodeLabel = ({ pedido }: { pedido: PedidoType }) => {
  const { id, cliente, detalle, items, movimientos } = pedido;
  const estado = getEstado(movimientos);
  const toast = useToast();
  const { fecha } = movimientos.Inicializado;
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const printStyles = `
  @media print {
    @page {
      margin: 5mm;
    }
    body {
      background: white !important;
    }
  }
`;
  return (
    <Flex direction='column' align='center' gap={4}>
      <style>{printStyles}</style>
      {/* Contenido imprimible */}
      <Flex
        ref={contentRef}
        direction='column'
        border='1px solid gray'
        borderRadius={5}
        p={4}
        w='300px'
        fontSize='sm'
        bg='white'
        color='black'
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

      {/* Botón de impresión */}

      <Button
        onClick={() => {
          if (estado === 'Inicializado') {
            toast({
              title: 'Actualizar Estado',
              description: 'Confirma los datos para poder imprimir la etiqueta',
              isClosable: true,
              duration: 5000,
              status: 'error',
            });
            return;
          }
          reactToPrintFn();
        }}
        bg='gray.700'
        color='white'
        size='sm'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        rightIcon={<IoMdPrint />}
      >
        Imprimir
      </Button>
    </Flex>
  );
};

export default QRCodeLabel;
