import PopoverInfoIcon from '@/components/inicio/PopoverInfoIcon';
import TitleSearch from '@/components/movimientos/TitleSearch';
import { ProductoType, UserType } from '@/types/types';
import {
  DeleteIcon,
  EditIcon,
  MinusIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons';
import {
  Button,
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
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';

const AgregarProductoAsignado = ({
  user,
  allProductos,
  updateInventario,
  loading,
  checkUpdates,
}: {
  user: UserType;
  allProductos: ProductoType[];
  updateInventario: (
    user: UserType,
    newInventario: ProductoType[]
  ) => Promise<void>;
  loading: boolean;
  checkUpdates: () => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inventario, setInventario] = useState<ProductoType[]>([]);

  const handleCantidadChange = (id: string, cantidad: number) => {
    if (cantidad < 0) return;
    setInventario((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const deleteProducto = (id: string) => {
    setInventario((prev) => prev.filter((item) => item.id !== id));
  };

  const addProducto = (producto: ProductoType) => {
    if (user.inventario.some((p) => p.id === producto.id)) {
      toast({
        title: 'Ya asignado',
        description: `El usuario ya tiene el producto ${producto.nombre} asignado`,
      });
      return;
    }
    setInventario((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };
  const toast = useToast();
  const handleSave = async () => {
    const cantUpdate = inventario.some((it) => {
      const itemDB = allProductos?.find((p) => p.id === it.id);
      const itPrev = user.inventario?.find((p) => p.id === it.id);
      if (!itemDB) return false;

      const cantidadDisponible = itemDB.cantidad + (itPrev?.cantidad ?? 0);
      if (it.cantidad > cantidadDisponible) {
        console.log('ERROR:', it?.nombre);
      }

      return it.cantidad > cantidadDisponible;
    });
    const allZero = inventario.every((it) => it.cantidad === 0);
    if (!inventario || inventario.length === 0) {
      toast({
        title: 'Error',
        description: 'Debes ingresar algún producto',
        isClosable: true,
        status: 'warning',
        duration: 4000,
      });
      return;
    }
    if (allZero) {
      toast({
        title: 'Error',
        description: 'Debes ingresar cantidades mayores a 0 (cero)',
        isClosable: true,
        status: 'warning',
        duration: 4000,
      });
      return;
    }
    if (cantUpdate) {
      toast({
        title: 'Error',
        description: 'Ingresa cantidades válidas',
        isClosable: true,
        status: 'warning',
        duration: 4000,
      });
      return;
    }
    await updateInventario(user, inventario);
    handleClose();
  };
  const handleClose = () => {
    setInventario([]);
    onClose();
  };
  const handleSumar = (item: ProductoType) => {
    const { id, cantidad } = item;
    handleCantidadChange(id, cantidad + 1);
  };
  const handleRestar = (item: ProductoType) => {
    const { id, cantidad } = item;
    const next = cantidad - 1;
    if (next < 0) return;
    handleCantidadChange(id, next);
  };
  const handleOpen = async () => {
    checkUpdates();
    onOpen();
  };
  return (
    <Flex>
      <Button
        onClick={handleOpen}
        size='sm'
        colorScheme='blue'
        leftIcon={<BsPlusCircle />}
      >
        Agregar Productos
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size='3xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Productos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              <b>Usuario</b>: {user.nombre} {user.apellido}
            </Text>
            <VStack align='stretch' spacing={4}>
              {inventario.map((item) => {
                const itemDB = allProductos?.find((p) => p.id === item.id);
                const userItem = user.inventario.find((p) => p.id === item.id);
                const totalProductos =
                  (itemDB?.cantidad || 0) + (userItem?.cantidad || 0);
                return (
                  <Flex
                    key={item.id}
                    p={2}
                    borderWidth={1}
                    borderRadius='md'
                    justify='space-between'
                    flexDir='column'
                  >
                    <Text noOfLines={1}>{item.nombre}</Text>
                    <Flex
                      justify='space-between'
                      gap={2}
                      align='center'
                      w='100%'
                    >
                      <Text fontSize='sm' color='gray.500'>
                        Stock:{' '}
                        <b
                          style={{
                            color:
                              totalProductos < item.cantidad
                                ? 'red'
                                : undefined,
                          }}
                        >
                          {totalProductos}
                        </b>
                      </Text>
                      <Flex gap={1} align='center'>
                        <IconButton
                          aria-label='Restar'
                          size='sm'
                          icon={<MinusIcon />}
                          variant='ghost'
                          colorScheme='gray'
                          onClick={() => handleRestar(item)}
                        />
                        <Input
                          type='number'
                          value={item.cantidad}
                          onChange={(e) =>
                            handleCantidadChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          maxW='80px'
                          size='sm'
                        />
                        <Text fontSize='sm'>{item.medida}</Text>
                        <IconButton
                          aria-label='Sumar'
                          size='sm'
                          icon={<PlusSquareIcon />}
                          variant='ghost'
                          colorScheme='gray'
                          onClick={() => handleSumar(item)}
                        />
                        <IconButton
                          ml={3}
                          icon={<DeleteIcon />}
                          aria-label='Eliminar'
                          size='sm'
                          onClick={() => deleteProducto(item.id)}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                );
              })}

              <Flex pos='relative'>
                <TitleSearch
                  productos={allProductos}
                  addProducto={addProducto}
                />
              </Flex>
              <Flex justify='flex-end' mt={4} gap={3}>
                <Button size='sm' onClick={handleClose} variant='ghost'>
                  Cancelar
                </Button>
                <Button
                  isLoading={loading}
                  size='sm'
                  onClick={handleSave}
                  colorScheme='blue'
                >
                  Guardar
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AgregarProductoAsignado;
