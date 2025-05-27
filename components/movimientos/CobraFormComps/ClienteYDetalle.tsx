import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
const ClienteYDetalle = ({ isPago }: { isPago: boolean }) => {
  const { setDetalle, cliente, setCliente, detalle } = useCobrarFormContext();

  return (
    <Flex
      gap={5}
      flexDir={['column', 'column', 'row', 'row']}
      justify='space-between'
    >
      <Flex w='100%' gap={2} flexDir='column'>
        <FormControl isRequired>
          <FormLabel> {!isPago ? 'Servicio' : 'Nombre de la Compra'}</FormLabel>
          <Input
            placeholder={!isPago ? 'Datos de Servicio' : 'Agregar nombre'}
            borderRadius={5}
            borderColor='gray'
            maxW='300px'
            size='sm'
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </FormControl>
      </Flex>

      <Flex w='100%' gap={2} flexDir='column'>
        <FormControl isRequired>
          <FormLabel> Detalle</FormLabel>
          <Textarea
            placeholder='Agregar detalle'
            borderRadius={5}
            borderColor='gray'
            maxW='300px'
            size='sm'
            value={detalle}
            onChange={(e) => setDetalle(e.target.value as string)}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default ClienteYDetalle;
