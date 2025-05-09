import { extractSrcFromIframe } from '@/helpers/extractSrcFromIframe';
import { EstadoType, PedidoType, ProductoType } from '@/types/types';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ListItem,
  Switch,
  Text,
  Textarea,
  UnorderedList,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import MapEmbed from '../../EmbedMap';
import TitleSearch from '../../TitleSearch';

type ItemsHandlerType = [
  ProductoType[],
  React.Dispatch<React.SetStateAction<ProductoType[]>>
];
type StringHandler = [string, React.Dispatch<React.SetStateAction<string>>];
type NumberHandler = [
  number | null,
  React.Dispatch<React.SetStateAction<number | null>>
];
const ModalBodyBottomPart = ({
  estado,
  productos,
  checkedItemsHandler,
  itemsHandler,
  clienteHandler,
  detalleHandler,
  tramoHandler,
  mapCoordsHandler,
  sobrantesHandler,
}: {
  estado: EstadoType;
  productos: ProductoType[] | null;
  checkedItemsHandler: [any[], React.Dispatch<React.SetStateAction<any[]>>];
  itemsHandler: ItemsHandlerType;
  clienteHandler: StringHandler;
  detalleHandler: StringHandler;
  tramoHandler: NumberHandler;
  mapCoordsHandler: StringHandler;
  sobrantesHandler: [
    ProductoType[],
    React.Dispatch<React.SetStateAction<ProductoType[]>>
  ];
}) => {
  const [items, setItems] = itemsHandler;
  const [cliente, setCliente] = clienteHandler;
  const [detalle, setDetalle] = detalleHandler;
  const [checkedItems, setCheckedItems] = checkedItemsHandler;
  const [tramo, setTramo] = tramoHandler;
  const [embedValue, setEmbedValue] = useState('');
  const [mapCoords, setMapCoords] = mapCoordsHandler;
  const [sobrantes, setSobrantes] = sobrantesHandler;
  const toast = useToast();
  const checkItem = (id: string) => {
    const newCheckedItems = checkedItems.map((i: any) => {
      if (i.id === id) {
        return { ...i, checked: !i.checked };
      }
      return i;
    });
    setCheckedItems(newCheckedItems);
  };
  const confirmMap = () => {
    const src = extractSrcFromIframe(embedValue);
    if (!src) {
      toast({
        title: 'Error',
        description: 'Ingresá un iframe válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setMapCoords(src);
    setEmbedValue('');
  };

  const addProducto = (producto: ProductoType) => {
    const { id } = producto;
    const newItems = items.some((i) => i.id === id)
      ? items.map((p) => {
          if (p?.id === producto?.id)
            return { ...p, unidades: (p?.unidades || 0) + 1 };
          return p;
        })
      : [...items, { ...producto, unidades: producto?.unidades || 1 }];
    setItems(newItems);
  };
  const deleteProducto = (id: string) => {
    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);
  };
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setItems((prevItems) => {
      const newItems = prevItems?.map((i) =>
        i.id === name ? { ...i, unidades: Number(value) || 0 } : i
      );
      return newItems;
    });
  };
  return (
    <>
      {estado === 'Inicializado' && (
        <VStack align='start' spacing={3}>
          {/* <Text>
                   <b>Cliente:</b> {cliente}
                 </Text> */}

          <FormControl>
            <FormLabel>Cliente</FormLabel>
            <Input
              placeholder='Cliente'
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Detalle</FormLabel>
            <Textarea
              placeholder='Detalle'
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              resize='vertical'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Tramo</FormLabel>
            <Flex gap={2} align='center'>
              <Input
                placeholder='Tramo'
                size='sm'
                borderRadius={5}
                maxW='80px'
                value={tramo || ''}
                type='number'
                onChange={(e) => setTramo(Number(e.target.value))}
              />
              <Text>Mts.</Text>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>Mapa (embed iframe)</FormLabel>
            {!mapCoords && (
              <Flex align='center' gap={2}>
                <Input
                  size='sm'
                  maxW='600px'
                  borderColor='gray'
                  borderRadius={5}
                  value={embedValue}
                  placeholder='Insertar mapa html'
                  onChange={(e) => setEmbedValue(e.target.value)}
                />
                <Button
                  onClick={confirmMap}
                  size='sm'
                  bg='blue.700'
                  color='white'
                >
                  Confirm
                </Button>
              </Flex>
            )}
            <MapEmbed clean={() => setMapCoords('')} src={mapCoords} />
          </FormControl>
          <Box w='100%'>
            <Text mt={4} mb={2} fontWeight='semibold'>
              Productos del pedido:
            </Text>
            <VStack spacing={2} align='stretch'>
              {items.map((item) => {
                return (
                  <Flex
                    key={item.id + 'listed-item-key'}
                    justify='space-between'
                    align='center'
                    p={2}
                    bg='gray.100'
                    borderRadius='md'
                    _dark={{ bg: 'gray.700' }}
                  >
                    <Text>{item.nombre}</Text>
                    <Text
                      color={
                        !item?.unidades || item.cantidad >= item.unidades
                          ? undefined
                          : 'red'
                      }
                    >
                      {item.cantidad}
                    </Text>
                    <HStack>
                      {/* Input editable (reemplazá por lógica real si querés permitir editar) */}
                      <Input
                        type='number'
                        size='sm'
                        name={item.id}
                        onChange={onChange}
                        w='60px'
                        defaultValue={item.unidades}
                        // onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                      />
                      <Text fontSize='sm'>{item.medida}</Text>
                      <DeleteIcon
                        fontSize='sm'
                        cursor='pointer'
                        _hover={{ opacity: 0.65 }}
                        onClick={() => deleteProducto(item.id)}
                      />
                    </HStack>
                  </Flex>
                );
              })}
            </VStack>
            <Flex pos='relative' my={3}>
              <TitleSearch
                productos={productos || []}
                addProducto={addProducto}
              />
            </Flex>
          </Box>
        </VStack>
      )}
      {estado === 'Preparación' && (
        <UnorderedList fontSize='lg' w='100%' maxW='300px'>
          {items.map((i) => {
            return (
              <ListItem key={`preparacion-key-${i.id}`} w='100%'>
                <Flex
                  borderBottom='1px solid #BEBEBE'
                  w='100%'
                  justify='space-between'
                >
                  <Text>{i.nombre}</Text>
                  <Checkbox
                    borderColor='#BEBEBE'
                    isChecked={checkedItems.some(
                      (it: any) => it.id === i.id && it.checked
                    )}
                    onChange={() => checkItem(i.id)}
                  />
                </Flex>
              </ListItem>
            );
          })}
        </UnorderedList>
      )}
      {estado === 'Pendiente' && (
        <Flex gap={2} flexDir='column'>
          <Text>Verificá que estén todos los productos.</Text>
          <UnorderedList fontSize='lg' w='100%' maxW='300px'>
            {items.map((i) => {
              return (
                <ListItem key={`prendiente-key-${i.id}`} w='100%'>
                  <Flex w='100%' justify='space-between'>
                    <Text>
                      {i.nombre} x{' '}
                      <b>
                        {i.unidades} ({i.medida})
                      </b>
                    </Text>
                  </Flex>
                </ListItem>
              );
            })}
          </UnorderedList>
        </Flex>
      )}
      {estado === 'En curso' && (
        <Flex gap={2} flexDir='column'>
          <Text fontWeight='medium'>Confirmar sobrante de materiales:</Text>
          <UnorderedList fontSize='md' w='100%' maxW='400px'>
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
                  prev.map((s) =>
                    s.id === i.id ? { ...s, cantidad: value } : s
                  )
                );
              };

              return (
                <ListItem key={`${i.id}-sobrantes`} w='100%'>
                  <Flex
                    gap={4}
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
                        sobrante &&
                        i?.unidades &&
                        sobrante?.cantidad > i?.unidades
                          ? 'red.500'
                          : 'gray.500'
                      }
                      minW='100px'
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
        </Flex>
      )}
    </>
  );
};

export default ModalBodyBottomPart;
