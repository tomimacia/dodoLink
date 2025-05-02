import { Flex } from '@chakra-ui/react';

const Movimientos = () => {
  return (
    <Flex my={3} gap={4} flexDir='column'>
      {/* <Flex gap={2} flexDir={['column', 'column', 'column', 'column', 'row']}>
        <MovimientosGraphProvider>
          <MovimientosStatus />
          <MovimientosGraph />
        </MovimientosGraphProvider>
      </Flex>
      <Divider my={3} borderColor='gray' />
      <CierresDeCaja /> */}
      Proximamente
    </Flex>
  );
};

export default Movimientos;
