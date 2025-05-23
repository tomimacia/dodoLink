import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { extractSrcFromIframe } from '@/helpers/extractSrcFromIframe';
import { EstadoType, ProductoType } from '@/types/types';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
  checkedItemsHandler,
  itemsHandler,
  clienteHandler,
  detalleHandler,
  tramoHandler,
  mapCoordsHandler,
  sobrantesHandler,
  productos,
  volverAInicializado,
  loading,
  isRetiro,
}: {
  estado: EstadoType;
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
  productos: ProductoType[];
  volverAInicializado: () => Promise<void>;
  loading: boolean;
  isRetiro: boolean;
}) => {
  const [items, setItems] = itemsHandler;
  const [cliente, setCliente] = clienteHandler;
  const [detalle, setDetalle] = detalleHandler;
  const [checkedItems, setCheckedItems] = checkedItemsHandler;
  const [tramo, setTramo] = tramoHandler;
  const [embedValue, setEmbedValue] = useState('');
  const [mapCoords, setMapCoords] = mapCoordsHandler;
  const [sobrantes, setSobrantes] = sobrantesHandler;
  const customGrayBG = useColorModeValue('gray.700', 'gray.500');
  const toast = useToast();
  const [loadingNew, setLoadingNew] = useState(false);
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
  useEffect(() => {
    if (estado !== 'Inicializado') return;
    const updateItems = async () => {
      const newItemsPromise = items.map((i) => getSingleDoc('productos', i.id));
      setLoadingNew(true);
      try {
        const newItemsFetched = (await Promise.all(
          newItemsPromise
        )) as ProductoType[];
        const newItems = items.map((prevItem) => {
          const findNew = newItemsFetched.find((i) => i?.id === prevItem.id);
          return findNew
            ? { ...prevItem, cantidad: findNew.cantidad }
            : prevItem;
        });
        setItems(newItems);
      } catch (e) {
        console.error(e);
      }
      setLoadingNew(false);
    };
    updateItems();
  }, []);
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
          <Divider borderColor='gray' />
          <Flex gap={3} flexDir='column' w='100%'>
            <Text fontWeight='bold'>Agregar Producto</Text>
            <Flex pos='relative' gap={2} flexDir='column'>
              <TitleSearch
                productos={productos || []}
                addProducto={addProducto}
              />
            </Flex>
            <Text mt={4} mb={2} fontWeight='semibold'>
              Productos del pedido:
            </Text>
            <TableContainer>
              <Table size='sm' variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Nombre</Th>
                    <Th>Stock</Th>
                    <Th>Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item) => (
                    <Tr key={item.id}>
                      {/* Nombre del producto */}
                      <Td
                        maxW='300px'
                        overflow='hidden'
                        whiteSpace='nowrap'
                        textOverflow='ellipsis'
                        title={item.nombre}
                      >
                        {item.nombre}
                      </Td>
                      {/* Stock disponible */}
                      <Td
                        color={
                          !item?.unidades || item.cantidad >= item.unidades
                            ? undefined
                            : 'red'
                        }
                      >
                        {item.cantidad || 'Sin stock'}
                      </Td>
                      {/* Cantidad en el pedido */}
                      <Td w='80px'>
                        <Input
                          type='number'
                          size='sm'
                          name={item.id}
                          onChange={onChange}
                          w='60px'
                          defaultValue={item.unidades}
                          onKeyDown={(e) => {
                            if (
                              ['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(
                                e.key
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onWheel={(e: any) => e.target.blur()}
                          // onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                        />
                      </Td>
                      <Td w='20px'>
                        <Button
                          variant='link'
                          color='red'
                          onClick={() => deleteProducto(item.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </VStack>
      )}
      {estado === 'Preparación' && (
        <Flex gap={2} flexDir='column'>
          <Flex gap={2} p={2} borderRadius={5} flexDir='column'>
            <Heading fontSize='lg'>Confirmar Productos</Heading>
            <UnorderedList fontSize='lg' w='100%'>
              {items.map((i) => {
                return (
                  <ListItem key={`preparacion-key-${i.id}`} w='100%'>
                    <Flex
                      justify='space-between'
                      align='center'
                      borderBottom='1px solid #BEBEBE'
                      w='100%'
                      gap={4}
                      py={2}
                    >
                      {/* Contenedor de texto (nombre y unidades) */}
                      <Flex flex='1' minW='0' justify='space-between' gap={2}>
                        {/* Nombre truncado */}
                        <Text
                          title={i.nombre}
                          fontWeight='bold'
                          whiteSpace='nowrap'
                          overflow='hidden'
                          textOverflow='ellipsis'
                          maxW='100%'
                        >
                          {i.nombre}
                        </Text>

                        {/* Unidades y medida */}
                        <Text flexShrink={0}>
                          x {i.unidades} {i.medida}
                        </Text>
                      </Flex>

                      {/* Checkbox */}
                      <Checkbox
                        flexShrink={0}
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
          </Flex>
          <Flex gap={1} flexDir='column'>
            <Text>¿Debes realizar cambios?</Text>
            <Button
              _hover={{ opacity: 0.65 }}
              color='white'
              bg={customGrayBG}
              w='fit-content'
              size='sm'
              disabled={loading}
              onClick={volverAInicializado}
            >
              Volver a Inicializado
            </Button>
          </Flex>
        </Flex>
      )}
      {estado === 'Pendiente' && (
        <Flex gap={2} flexDir='column'>
          <Text>Verificá que estén todos los productos.</Text>
          <UnorderedList fontSize='lg' w='100%'>
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
      {estado === 'En curso' &&
        (isRetiro ? (
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
                    prev.map((s) =>
                      s.id === i.id ? { ...s, cantidad: value } : s
                    )
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
                          sobrante &&
                          i?.unidades &&
                          sobrante?.cantidad > i?.unidades
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
          </Flex>
        ))}
    </>
  );
};

export default ModalBodyBottomPart;
