import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { Flex, Input, Text, Textarea } from '@chakra-ui/react';
const ClienteYDetalle = () => {
  const { setDetalle, cliente, setCliente, detalle, isPago } =
    useCobrarFormContext();

  return (
    <Flex
      gap={5}
      flexDir={['column', 'column', 'row', 'row']}
      justify='space-between'
    >
      <Flex gap={2} w='100%' flexDir='column'>
        <Flex gap={2} flexDir='column'>
          <Text fontSize='lg' fontWeight='bold'>
            Cliente
          </Text>
          <Input
            placeholder='Datos de Cliente'
            borderRadius={5}
            borderColor='gray'
            maxW='300px'
            size='sm'
            isDisabled={isPago}
            value={cliente}
            disabled={isPago}
            onChange={(e) => setCliente(e.target.value)}
          />
        </Flex>
      </Flex>
      <Flex w='100%' gap={2} flexDir='column'>
        <Text fontSize='lg' fontWeight='bold'>
          Detalle
        </Text>
        <Textarea
          placeholder='Agregar detalle'
          borderRadius={5}
          borderColor='gray'
          maxW='300px'
          size='sm'
          value={detalle}
          onChange={(e) => setDetalle(e.target.value as string)}
        />
      </Flex>
    </Flex>
  );
};

export default ClienteYDetalle;
