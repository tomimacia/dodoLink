import { ProductoType } from '@/types/types';
import { WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ListItem,
  Switch,
  Text,
  Textarea,
  UnorderedList,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
type StringHandler = [string, Dispatch<SetStateAction<string>>];
type ItemsHandlerType = [
  ProductoType[],
  Dispatch<SetStateAction<ProductoType[]>>
];
const ConfirmarEnCurso = ({
  isRetiro,
  imagenes,
  items,
  notaHandler,
  sobrantesHandler,
}: {
  isRetiro: boolean;
  imagenes: any[];
  items: ProductoType[];
  notaHandler: StringHandler;
  sobrantesHandler: ItemsHandlerType;
}) => {
  const [nota, setNota] = notaHandler;
  const [sobrantes, setSobrantes] = sobrantesHandler;
  const [agregarNota, setAgregarNota] = useState(false);
  return isRetiro ? (
    <Flex gap={2} flexDir='column'>
      <Text fontWeight='medium'>Confirmar pedido finalizado</Text>
    </Flex>
  ) : (
    <Flex gap={2} flexDir='column'>
      <Text fontWeight='medium'>Confirmar sobrante de materiales:</Text>
      <UnorderedList spacing={2} fontSize='md'>
        {items.map((i) => {
          const sobrante = sobrantes.find((s) => s.id === i.id);
          const isChecked = !!sobrante;

          const toggleSobrante = () => {
            if (isChecked) {
              setSobrantes((prev) => prev.filter((s) => s.id !== i.id));
            } else {
              setSobrantes((prev) => [...prev, { ...i, cantidad: 0 }]);
            }
          };

          const updateCantidad = (value: number) => {
            setSobrantes((prev) =>
              prev.map((s) => (s.id === i.id ? { ...s, cantidad: value } : s))
            );
          };

          return (
            <ListItem key={`${i.id}-sobrantes`} w='100%'>
              <Flex
                gap={2}
                align='center'
                p={3}
                borderRadius='lg'
                boxShadow='sm'
                bg='white'
                _dark={{ bg: 'gray.800' }}
                border='1px solid'
                borderColor='gray.200'
                transition='all 0.2s'
                _hover={{ boxShadow: 'md' }}
              >
                <Text
                  fontSize='sm'
                  color={
                    sobrante && i?.unidades && sobrante?.cantidad > i?.unidades
                      ? 'red.500'
                      : 'gray.500'
                  }
                >
                  {i.unidades} {i.medida}
                </Text>

                <Switch
                  isChecked={isChecked}
                  onChange={toggleSobrante}
                  size='md'
                  colorScheme='blue'
                />

                <Text
                  onClick={toggleSobrante}
                  fontWeight='medium'
                  flex={1}
                  fontSize='md'
                  cursor='pointer'
                >
                  {i.nombre}
                </Text>

                <Input
                  placeholder='Cantidad'
                  type='number'
                  size='sm'
                  maxW='100px'
                  borderRadius='md'
                  borderColor='gray.300'
                  isDisabled={!isChecked}
                  value={
                    sobrante?.cantidad && sobrante?.cantidad > 0
                      ? sobrante?.cantidad
                      : ''
                  }
                  onChange={(e) => updateCantidad(Number(e.target.value))}
                />

                <Text fontSize='sm' color='gray.500' textAlign='right'>
                  {i.medida}
                </Text>
              </Flex>
            </ListItem>
          );
        })}
      </UnorderedList>
      <Divider />
      <Box>
        <Flex
          as={FormControl}
          gap={3}
          align='center'
          p={3}
          borderRadius='lg'
          boxShadow='sm'
          w='fit-content'
          border='1px solid #EEEEEE'
          transition='all 0.2s'
          _hover={{ boxShadow: '0 0 3px' }}
          cursor='pointer'
          onClick={() =>
            setAgregarNota((prev) => {
              if (prev) {
                setNota('');
              }
              return !prev;
            })
          }
        >
          <Text cursor='pointer' mb='0' fontWeight='medium'>
            ¿Deseás agregar una nota?
          </Text>
          <Switch
            isChecked={agregarNota}
            onChange={() => {}} // vacío porque usamos onClick en el contenedor
            pointerEvents='none' // evita conflicto con el click del contenedor
          />
        </Flex>

        <Collapse in={agregarNota} animateOpacity>
          <Box mt={3}>
            <FormControl>
              <FormLabel>Nota</FormLabel>
              <Textarea
                placeholder='Escribí una nota opcional...'
                value={nota}
                minH={150}
                onChange={(e) => setNota(e.target.value)}
              />
            </FormControl>
          </Box>
        </Collapse>
      </Box>
      {!imagenes ||
        (imagenes.length === 0 && (
          <Flex gap={1} align='center'>
            <WarningIcon color='red' />
            <Text color='red.600' fontWeight='bold'>
              No cargaste imágenes
            </Text>
          </Flex>
        ))}
    </Flex>
  );
};

export default ConfirmarEnCurso;
