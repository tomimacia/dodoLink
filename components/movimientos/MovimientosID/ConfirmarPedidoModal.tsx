import { getEstado } from '@/helpers/cobros/getEstado';
import { Estados, PedidoType, ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  Input,
  Box,
  Divider,
  VStack,
  HStack,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import MapEmbed from '../EmbedMap';
import { extractSrcFromIframe } from '@/helpers/extractSrcFromIframe';
import TitleSearch from '../TitleSearch';
import useGetProductos from '@/hooks/data/useGetProductos';
import { DeleteIcon } from '@chakra-ui/icons';

const ConfirmarPedidoModal = ({
  loading,
  update,
  pedido,
}: {
  loading: boolean;
  update: (newPedido: PedidoType) => Promise<void>;
  pedido: PedidoType;
}) => {
  const { id, movimientos } = pedido;
  const estado = getEstado(movimientos);
  const { productos } = useGetProductos();
  const [items, setItems] = useState(pedido.items);
  const [cliente, setCliente] = useState(pedido.cliente);
  const [detalle, setDetalle] = useState(pedido.detalle);
  const [tramo, setTramo] = useState(pedido.tramo);
  const [embedValue, setEmbedValue] = useState('');
  const [mapCoords, setMapCoords] = useState(pedido.mapCoords);
  const nextEstado = Estados[Estados.indexOf(estado) + 1];
  const fontColor = useColorModeValue('red.700', 'red.600');
  const nextEstadoColor = useColorModeValue('blue.600', 'blue.300');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = async () => {
    const newPedido: PedidoType = {
      ...pedido,
      cliente,
      detalle,
      tramo,
      items,
      mapCoords,
    };
    await update(newPedido);
    onClose();
  };
  const toast = useToast();
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
  const handleClose = () => {
    setCliente(pedido.cliente);
    setDetalle(pedido.detalle);
    setTramo(pedido.tramo);
    setMapCoords(pedido.mapCoords);
    setItems(pedido.items);
    onClose();
  };
  return (
    <Flex>
      <Button
        bg='blue.700'
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        onClick={onOpen}
      >
        Confirmar
      </Button>

      <Modal
        size={['xl', '2xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius='2xl' p={2}>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader p={4} fontWeight='bold'>
            Confirmar actualización del pedido #{id}
          </ModalHeader>
          <Divider />
          <ModalBody py={4}>
            <Flex mb='3' flexDir='column' gap={1}>
              <Text fontWeight='medium'>
                ¿Querés continuar con la actualización del pedido?
              </Text>
              <Text>
                Revisá que los datos estén correctos antes de confirmar.
              </Text>
            </Flex>
            <VStack align='start' spacing={3}>
              {/* <Text>
                <b>Cliente:</b> {cliente}
              </Text> */}
              <Text>
                <b>Estado actual:</b> {estado}
              </Text>
              <Text>
                <b>Actualizar a:</b>{' '}
                <Text as='span' fontWeight='bold' color={nextEstadoColor}>
                  {nextEstado}
                </Text>
              </Text>
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
                  {items.map((item) => (
                    <Flex
                      key={item.id}
                      justify='space-between'
                      align='center'
                      p={2}
                      bg='gray.100'
                      borderRadius='md'
                      _dark={{ bg: 'gray.700' }}
                    >
                      <Text>{item.nombre}</Text>
                      <HStack>
                        {/* Input editable (reemplazá por lógica real si querés permitir editar) */}
                        <Input
                          type='number'
                          size='sm'
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
                  ))}
                </VStack>
                <Flex pos='relative' my={3}>
                  <TitleSearch
                    productos={productos || []}
                    addProducto={addProducto}
                  />
                </Flex>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Flex justify='center' gap={4} w='100%'>
              <Button
                bg='blue.700'
                color='white'
                w='fit-content'
                _hover={{ opacity: 0.8 }}
                onClick={handleUpdate}
                isLoading={loading}
              >
                Confirmar
              </Button>
              <Button
                bg={fontColor}
                color='white'
                w='fit-content'
                _hover={{ opacity: 0.65 }}
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ConfirmarPedidoModal;
