import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
  VStack,
  HStack,
  Input,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  EditIcon,
  DeleteIcon,
  PlusSquareIcon,
  MinusIcon,
} from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ProductoType, UserType } from '@/types/types';
import TitleSearch from '@/components/movimientos/TitleSearch';
import PopoverInfoIcon from '@/components/inicio/PopoverInfoIcon';

const EditarInventarioModal = ({
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
    newInventario: ProductoType[],
    ajustarStock: boolean
  ) => Promise<void>;
  loading: boolean;
  checkUpdates: () => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inventario, setInventario] = useState<ProductoType[]>(
    user.inventario || []
  );
  const [devolverStock, setDevolverStock] = useState(false);

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
    if (inventario.some((p) => p.id === producto.id)) return;
    setInventario((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };

  const handleSave = async () => {
    await updateInventario(user, inventario, devolverStock);
    onClose();
  };
  const handleClose = () => {
    setInventario(user.inventario);
    setDevolverStock(false);
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
        leftIcon={<EditIcon />}
      >
        Editar Inventario
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size='3xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user.nombre} {user.apellido}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl gap={3} mb={2} display='flex' alignItems='center'>
              <FormLabel htmlFor='devolver-stock' mb='0'>
                Ajustar stock
              </FormLabel>
              <Switch
                id='devolver-stock'
                isChecked={devolverStock}
                onChange={() => setDevolverStock((prev) => !prev)}
                colorScheme='blue'
              />
              <PopoverInfoIcon>
                <Text>
                  Indicar si el stock se devuelve al inventario (y se suma) o si
                  fue utilizado
                </Text>
              </PopoverInfoIcon>
            </FormControl>
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
                <Button size='sm' onClick={onClose} variant='ghost'>
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

export default EditarInventarioModal;
