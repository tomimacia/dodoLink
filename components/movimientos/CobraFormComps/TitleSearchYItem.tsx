import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { MedidaType, ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import TitleSearch from '../TitleSearch';

const TitleSearchYItem = () => {
  const { productos, items, setItems } = useCobrarFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialItem = {
    nombre: '',
    id: '',
    medida: 'Un.' as MedidaType,
    codigo: [],
    cantidad: 1,
    unidades: 1,
    empresa: 'dodoLink',
    cantidadPorPack: 1,
    target: 999999,
  };
  const [newItem, setNewItem] = useState<ProductoType>(initialItem);
  const toast = useToast();
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
  const onChangeNewItem = (e: any) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };
  const addNewItem = (newItem: ProductoType) => {
    if (!newItem.nombre || !newItem.cantidad)
      return toast({
        title: 'Error',
        description: 'Debe completar los campos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    addProducto({
      ...newItem,
      codigo: [items.length * 77],
      id: items.length * 77 + '',
      cantidad: Number(newItem.cantidad),
      unidades: Number(newItem.cantidad),
    });
    setNewItem(initialItem);
    onClose();
  };

  const valueRefNombre = useRef<HTMLInputElement | null>(null);
  const valueRefPrecio = useRef<HTMLInputElement | null>(null);
  const onKeyDownNombre = useEnter(valueRefNombre, () => addNewItem(newItem));
  const onKeyDownPrecio = useEnter(valueRefPrecio, () => addNewItem(newItem));
  return (
    <Flex align='center' justify='space-between' pos='relative' w='100%'>
      <TitleSearch addProducto={addProducto} productos={productos || []} />
      <Flex w='50%'>
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <PopoverTrigger>
            <Button
              bg='gray.600'
              color='white'
              _hover={{ opacity: 0.7 }}
              w='fit-content'
              alignSelf='center'
              my={2}
              size='sm'
            >
              Agregar Item
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverBody>
                <PopoverCloseButton
                  zIndex={1000}
                  cursor='pointer'
                  onClick={onClose}
                />
                <FormControl>
                  <FormLabel>Concepto</FormLabel>
                  <Input
                    onChange={onChangeNewItem}
                    value={newItem.nombre}
                    name='nombre'
                    ref={valueRefNombre}
                    autoComplete='off'
                    borderColor='gray'
                    onKeyDown={onKeyDownNombre}
                    borderRadius={5}
                    size='sm'
                    maxW='400px'
                    placeholder='Router, cable...'
                  />
                </FormControl>
                <FormControl my={2}>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    onChange={onChangeNewItem}
                    value={newItem.cantidad !== 0 ? newItem.cantidad : ''}
                    type='number'
                    ref={valueRefPrecio}
                    borderColor='gray'
                    onKeyDown={onKeyDownPrecio}
                    borderRadius={5}
                    size='sm'
                    maxW='400px'
                    autoComplete='off'
                    name='cantidad'
                    placeholder='2, 15...'
                  />
                </FormControl>
                <Button
                  onClick={() => {
                    addNewItem(newItem);
                    onClose(); // 🔹 Cierra el popover manualmente después de agregar
                  }}
                  mt={2}
                  colorScheme='blue'
                  size='sm'
                >
                  Aceptar
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
    </Flex>
  );
};

export default TitleSearchYItem;
