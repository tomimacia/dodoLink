import { Flex } from '@chakra-ui/react';

const Clientes = () => {
  return (
    <Flex
      my={3}
      gap={2}
      flexDir={['column', 'column', 'column', 'column', 'row']}
    >
      {/* <ClientesStatus />
      <ClientsGraphProvider>
        <ClientsGraph />
      </ClientsGraphProvider> */}
      Proximamente
    </Flex>
  );
};

export default Clientes;
