import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { ProductoType } from '@/types/types';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import ProductoCardDrawer from './ProductoCardDrawer';
import usePagination from '@/hooks/data/usePagination';
import PaginationControl from '@/components/reservas/PaginationControl';

const CompraDrawer = () => {
  const { setItems, items, productos } = useCobrarFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [consulta, setConsulta] = useState('');
  const [soloMarcados, setSoloMarcados] = useState(false);
  const btnRef = useRef<any>();
  const faltantes = productos?.filter((p) => p.cantidad <= p.target);

  const [seleccionados, setSeleccionados] = useState<ProductoType[]>([]);

  const toggleSeleccion = (producto: ProductoType) => {
    const { id } = producto;
    setSeleccionados((prev: any[]) => {
      const existe = prev.find((item) => item.id === id);
      if (existe) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [
          ...prev,
          { ...producto, unidades: producto.cantidadPorPack || 1 },
        ];
      }
    });
  };
  const getCantidad = (id: string) =>
    seleccionados.find((item) => item.id === id)?.unidades ?? '';
  const isSeleccionado = (id: string) =>
    seleccionados.some((item) => item.id === id);
  const handleChange = (e: any, id: string) => {
    const newSeleccionados = seleccionados.map((p) =>
      p.id === id ? { ...p, unidades: Number(e.target.value) } : p
    );
    setSeleccionados(newSeleccionados);
  };
  const filteredByInput = useCallback(() => {
    if (consulta.length < 3) return faltantes;
    return faltantes?.filter((p) =>
      p?.nombre?.toLowerCase().includes(consulta.toLowerCase())
    );
  }, [consulta, faltantes]);
  const productosFiltered = soloMarcados
    ? seleccionados
    : filteredByInput() || [];
  const itemsPerPage = 10;
  const { page, totalPages, paginatedArr, handlePageChange } = usePagination(
    productosFiltered,
    itemsPerPage
  );
  const marcarTodos = () => {
    const newSelecccionados = productosFiltered?.map((p) => {
      return { ...p, cantidad: 0, unidades: 0 };
    });
    setSeleccionados(newSelecccionados || []);
  };
  const reset = () => setSeleccionados([]);
  const handlePacks = (item: ProductoType, isSum: boolean) => {
    const newSeleccionados = seleccionados.map((p) => {
      if (p.id === item.id) {
        return {
          ...p,
          unidades: isSum
            ? (p.unidades || 0) + p.cantidadPorPack
            : (p.unidades || 0) - p.cantidadPorPack,
        };
      }
      return p;
    });
    setSeleccionados(newSeleccionados);
  };
  const handleClose = () => {
    setConsulta('');
    setSeleccionados([]);
    onClose();
  };
  const confirmar = () => {
    const newItems = items.filter(
      (i) => !seleccionados.some((it) => it.id === i.id)
    );
    setItems([...newItems, ...seleccionados]);
    handleClose();
  };
  return (
    <>
      <Button
        size='sm'
        w='fit-content'
        ref={btnRef}
        colorScheme='blue'
        onClick={onOpen}
      >
        Ver Faltantes
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={handleClose}
        finalFocusRef={btnRef}
        size='md'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Listado de Faltantes</DrawerHeader>

          <DrawerBody>
            <Input
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder='Filtrar faltantes'
              mb={4}
            />
            <Flex gap={1} flexDir='column'>
              <Flex gap={2}>
                <Button
                  size='sm'
                  bg='gray.700'
                  color='white'
                  onClick={marcarTodos}
                >
                  Marcar Todos
                </Button>
                <Button size='sm' bg='gray.700' color='white' onClick={reset}>
                  Reset
                </Button>
              </Flex>
              <Flex gap={2} align='center'>
                <FormControl display='flex' alignItems='center'>
                  <FormLabel cursor='pointer' htmlFor='solo-marcados' mb='0'>
                    Solo marcados
                  </FormLabel>
                  <Switch
                    id='solo-marcados'
                    isChecked={soloMarcados}
                    onChange={() => setSoloMarcados((prev) => !prev)}
                    colorScheme='blue'
                  />
                </FormControl>
              </Flex>
            </Flex>
            <Divider my={3} borderColor='gray' />
            <VStack align='stretch' spacing={4}>
              <Flex justify='center'>
                <PaginationControl
                  page={page}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  show={productosFiltered?.length > itemsPerPage}
                />
              </Flex>
              {paginatedArr?.map((p) => {
                return (
                  <ProductoCardDrawer
                    key={p.id}
                    p={p}
                    isSeleccionado={isSeleccionado}
                    toggleSeleccion={toggleSeleccion}
                    handlePacks={handlePacks}
                    getCantidad={getCantidad}
                    handleChange={handleChange}
                  />
                );
              })}
              {paginatedArr.length === 0 && <Text>No hay resultados</Text>}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={handleClose}>
              Cancelar
            </Button>
            <Button colorScheme='blue' onClick={confirmar}>
              Agregar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CompraDrawer;
