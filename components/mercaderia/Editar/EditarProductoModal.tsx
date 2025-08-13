import { ProductoType, UserType } from '@/types/types';
import { EditIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function EditarProductoModal({
  user,
  producto,
  productoDB,
  updateInventario,
  loading,
  checkUpdates,
}: {
  user: UserType;
  producto: ProductoType;
  productoDB?: ProductoType;
  updateInventario: (
    user: UserType,
    productoId: string,
    nuevaCantidad: number,
    devolverStock: boolean
  ) => Promise<void>;
  loading: boolean;
  checkUpdates: () => Promise<void>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modo, setModo] = useState<'actualizar' | 'devolver'>('actualizar');
  const [cantidadNueva, setCantidadNueva] = useState(producto.cantidad);
  const [cantidadDevuelta, setCantidadDevuelta] = useState(0);
  const customGray = useColorModeValue('gray.600', 'gray.300');
  const customRed = useColorModeValue('red.600', 'red.300');
  const customBlue = useColorModeValue('blue.500', 'blue.300');
  const toast = useToast();
  const handleSave = async (e: any) => {
    e.preventDefault();
    if (modo === 'devolver') {
      if (producto.cantidad < cantidadDevuelta) {
        toast({
          title: 'Error',
          status: 'warning',
          description: 'La cantidad devuelta es mayor que el stock de usuario',
          isClosable: true,
          duration: 4000,
        });
        return;
      }
      if (!cantidadDevuelta || cantidadDevuelta <= 0) {
        toast({
          title: 'Cantidad incorrecta',
          status: 'warning',
          description: 'Ingresá una cantidad válida para devolver',
          isClosable: true,
          duration: 4000,
        });
        return;
      }
    }
    if (modo === 'actualizar') {
      if (stockTotal < cantidadNueva) {
        toast({
          title: 'Error',
          status: 'warning',
          description: 'La cantidad nueva es mayor que el stock total',
          isClosable: true,
          duration: 4000,
        });
        return;
      }
      if (cantidadNueva === producto.cantidad) {
        toast({
          title: 'Misma cantidad',
          status: 'warning',
          description: 'Modificá la cantidad a asignar',
          isClosable: true,
          duration: 4000,
        });
        return;
      }
    }
    const cantidadFinal =
      modo === 'actualizar'
        ? cantidadNueva
        : Math.max(0, producto.cantidad - cantidadDevuelta);

    await updateInventario(
      user,
      producto.id,
      cantidadFinal,
      modo === 'devolver'
    );
    handleClose();
  };
  const handleClose = () => {
    setCantidadNueva(producto.cantidad);
    setCantidadDevuelta(0);
    setModo('actualizar');
    onClose();
  };

  const handlePlusCantidad = () => {
    const newCant = cantidadNueva + (producto.cantidadPorPack || 1);
    if (newCant >= 0) {
      setCantidadNueva(newCant);
    } else
      toast({
        title: 'Sin stock',
        description: 'No tienes stock suficiente para devolver',
        isClosable: true,
        duration: 5000,
        status: 'info',
      });
  };
  const handleMinusCantidad = () => {
    const newCant = cantidadNueva - (producto.cantidadPorPack || 1);
    if (newCant >= 0) {
      setCantidadNueva(newCant);
    } else
      toast({
        title: 'Sin stock',
        description: 'No tienes stock suficiente para devolver',
        isClosable: true,
        duration: 5000,
        status: 'info',
      });
  };
  const handlePlusDevuelta = () => {
    const newCant = cantidadDevuelta + (producto.cantidadPorPack || 1);
    if (newCant >= 0) {
      setCantidadDevuelta(newCant);
    } else
      toast({
        title: 'Sin stock',
        description: 'No tienes stock suficiente para devolver',
        isClosable: true,
        duration: 5000,
        status: 'info',
      });
  };
  const handleMinusDevuelta = () => {
    const newCant = cantidadDevuelta - (producto.cantidadPorPack || 1);
    if (newCant >= 0) {
      setCantidadDevuelta(newCant);
    } else
      toast({
        title: 'Sin stock',
        description: 'No tienes stock suficiente para devolver',
        isClosable: true,
        duration: 5000,
        status: 'info',
      });
  };
  const stockTotal = producto?.cantidad + (productoDB?.cantidad || 0);
  const handleOpen = async () => {
    checkUpdates();
    onOpen();
  };
  return (
    <>
      <IconButton
        size='xs'
        variant='outline'
        aria-label='editar-producto'
        icon={<EditIcon />}
        onClick={handleOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size='sm'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{producto.nombre}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Selector de modo */}
            <Flex gap={4} mb={4}>
              <Button
                size='sm'
                colorScheme='blue'
                variant={modo === 'actualizar' ? 'solid' : 'outline'}
                onClick={() => setModo('actualizar')}
                flex={1}
              >
                Actualizar stock
              </Button>
              <Button
                size='sm'
                colorScheme='blue'
                variant={modo === 'devolver' ? 'solid' : 'outline'}
                onClick={() => setModo('devolver')}
                flex={1}
              >
                Devolver stock
              </Button>
            </Flex>
            <Flex
              boxShadow='md'
              p={2}
              my={4}
              gap={0.5}
              borderRadius='lg'
              flexDir='column'
            >
              <Text fontSize='sm' color={customGray}>
                <b>Stock del depósito</b>: {productoDB?.cantidad || 0}{' '}
                {producto.medida}
              </Text>
              <Text fontSize='sm' color={customGray}>
                <b>Stock del usuario</b>: {producto.cantidad} {producto.medida}
              </Text>
              <Divider my={0.5} />
              <Text fontSize='md' color={customGray}>
                <b>Stock total</b>: {stockTotal} {producto.medida}
              </Text>
            </Flex>
            <form onSubmit={handleSave}>
              {modo === 'actualizar' && (
                <FormControl mb={4}>
                  <FormLabel>Cantidad nueva</FormLabel>
                  <Flex align='center' gap={1}>
                    <IconButton
                      aria-label='Restar'
                      size='sm'
                      icon={<MinusIcon />}
                      variant='ghost'
                      colorScheme='gray'
                      onClick={handleMinusCantidad}
                    />
                    <Input
                      type='number'
                      borderRadius='md'
                      borderColor={
                        stockTotal < cantidadNueva && !loading
                          ? customRed
                          : customGray
                      }
                      color={
                        stockTotal < cantidadNueva && !loading
                          ? customRed
                          : customGray
                      }
                      _focus={{
                        borderColor:
                          stockTotal < cantidadNueva && !loading
                            ? customRed
                            : customBlue,
                        boxShadow:
                          stockTotal < cantidadNueva && !loading
                            ? 'none'
                            : undefined,
                      }}
                      placeholder='Cantidad nueva'
                      value={cantidadNueva}
                      onChange={(e) =>
                        setCantidadNueva(parseInt(e.target.value) || 0)
                      }
                      size='sm'
                    />
                    <IconButton
                      aria-label='Sumar'
                      size='sm'
                      icon={<PlusSquareIcon />}
                      variant='ghost'
                      colorScheme='gray'
                      onClick={handlePlusCantidad}
                    />
                  </Flex>
                  {!loading && (
                    <Text
                      fontSize='sm'
                      color={
                        stockTotal < cantidadNueva ? customRed : customGray
                      }
                      fontWeight={
                        stockTotal < cantidadNueva ? 'semibold' : 'normal'
                      }
                      mt={1}
                      cursor='pointer'
                      _hover={{ textDecor: 'underline' }}
                      onClick={() => setCantidadNueva(stockTotal)}
                    >
                      Stock total (usuario + depósito): {stockTotal}
                    </Text>
                  )}
                </FormControl>
              )}

              {modo === 'devolver' && (
                <FormControl mb={4}>
                  <FormLabel>Cantidad a devolver</FormLabel>
                  <Flex align='center' gap={1}>
                    <IconButton
                      aria-label='Restar'
                      size='sm'
                      icon={<MinusIcon />}
                      variant='ghost'
                      colorScheme='gray'
                      onClick={handleMinusDevuelta}
                    />
                    <Input
                      type='number'
                      borderRadius='md'
                      borderColor={
                        producto.cantidad < cantidadDevuelta && !loading
                          ? customRed
                          : customGray
                      }
                      color={
                        producto.cantidad < cantidadDevuelta && !loading
                          ? customRed
                          : customGray
                      }
                      _focus={{
                        borderColor:
                          producto.cantidad < cantidadDevuelta && !loading
                            ? customRed
                            : customBlue,
                        boxShadow:
                          producto.cantidad < cantidadDevuelta && !loading
                            ? 'none'
                            : undefined,
                      }}
                      placeholder='Cantidad a devolver'
                      value={cantidadDevuelta}
                      onChange={(e) =>
                        setCantidadDevuelta(parseInt(e.target.value) || 0)
                      }
                      size='sm'
                    />
                    <IconButton
                      aria-label='Sumar'
                      size='sm'
                      icon={<PlusSquareIcon />}
                      variant='ghost'
                      colorScheme='gray'
                      onClick={handlePlusDevuelta}
                    />
                  </Flex>
                  {!loading && (
                    <Text
                      fontSize='sm'
                      color={
                        producto.cantidad < cantidadDevuelta
                          ? customRed
                          : customGray
                      }
                      fontWeight={
                        producto.cantidad < cantidadDevuelta
                          ? 'semibold'
                          : 'normal'
                      }
                      mt={1}
                      cursor='pointer'
                      _hover={{ textDecor: 'underline' }}
                      onClick={() => setCantidadDevuelta(producto.cantidad)}
                    >
                      Stock actual del usuario: {producto.cantidad}
                    </Text>
                  )}
                </FormControl>
              )}

              <Flex justify='flex-end' mt={6} gap={2}>
                <Button size='sm' onClick={handleClose} variant='ghost'>
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  colorScheme='blue'
                  type='submit'
                  isLoading={loading}
                >
                  Guardar
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
