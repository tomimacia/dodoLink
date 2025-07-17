import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

const CargarNodo = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Flex p={[1, 2, 2, 3, 3]} minH='50vh' maxW='700px' gap={5} flexDir='column'>
      <Heading as='h2' fontSize={24}>
        Carga de Nodo
      </Heading>
      <FormControl isRequired>
        <FormLabel>Nombre del Nodo</FormLabel>
        <Input
          placeholder='Agregar nombre'
          borderRadius={5}
          borderColor='gray'
          size='sm'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Detalle</FormLabel>
        <Textarea
          placeholder='Agregar detalle'
          borderRadius={5}
          borderColor='gray'
          size='sm'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value as string)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Equipos</FormLabel>
        <PlusSquareIcon
          onClick={() =>
            toast({
              title: 'Proximamente',
              isClosable: true,
              duration: 5000,
              status: 'info',
            })
          }
          cursor='pointer'
        />
      </FormControl>

      <Flex mt='auto' p={5} flexDir='column' gap={3}>
        <Button
          type='submit'
          mx='auto'
          ref={confirmButtonRef}
          w='50%'
          fontWeight='bold'
          size='sm'
          maxW='200px'
          mt={5}
          bg={fontColor}
          color='white'
          border='1px solid transparent'
          _hover={{ opacity: 0.7, border: '1px solid gray' }}
          isLoading={loading}
          onClick={() =>
            toast({
              title: 'Proximamente',
              isClosable: true,
              duration: 5000,
              status: 'info',
            })
          }
        >
          Confirmar
        </Button>
      </Flex>
    </Flex>
  );
};

export default CargarNodo;
