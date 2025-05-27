import { useUser } from '@/context/userContext';
import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import useGetProductos from '@/hooks/data/useGetProductos';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProductoType } from '@/types/types';
import {
  Flex,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { MdCancel, MdCheckBox, MdDelete } from 'react-icons/md';
import ReactLoading from 'react-loading';
import DeleteModal from '../DeleteModal';
import PaginationControl from '../reservas/PaginationControl';
import ProductoModal from './Editar/ProductoModal';
const ListadoProductos = () => {
  const {
    productos,
    loadingProductos,
    allPacks,
    setProductos,
    updateProducto,
  } = useGetProductos(true);
  const { loadingColor } = useThemeColors();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState('');
  const toast = useToast();

  const [filterInput, setFilterInput] = useState('');
  const updateProductoAndFront = async (
    productoID: string,
    newProduct: ProductoType
  ) => {
    await updateProducto(productoID, newProduct);
    const newProductos = productos?.map((p) => {
      if (p.id === productoID) return { ...newProduct, id: productoID };
      return p;
    });

    if (newProductos) setProductos(newProductos);
  };
  const [empresa, setEmpresa] = useState('dodoLink');
  const [pack, setPack] = useState('');
  const deleteProducto = async (pID: string) => {
    setLoading(true);
    try {
      await deleteSingleDoc('productos', pID);
      const newProductos = productos?.filter((p) => p.id !== pID);
      if (newProductos) setProductos(newProductos);
      await updateProductosLastStamp();
      toast({
        title: 'Producto eliminado',
        description: 'Producto eliminado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const itemsPerPage = 10;
  const filteredProductos = useMemo(() => {
    if (!productos) return [];
    return productos
      .filter((p) => {
        const isEmpresa = p.empresa === empresa;
        const matchPack = !pack || p.packs.includes(pack);
        const matchCategoria = !categoria || p.categoria === categoria;
        const matchesFilter =
          filterInput.length < 3 ||
          p?.nombre?.toLowerCase().includes(filterInput.toLowerCase());

        return isEmpresa && matchesFilter && matchPack && matchCategoria;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productos, empresa, filterInput, pack, categoria]);
  const {
    paginatedArr: paginatedProductos,
    page,
    totalPages,
    handlePageChange,
  } = usePagination(filteredProductos, itemsPerPage, true);

  return (
    <Flex flexDir='column' gap={3} mt={3}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        gap={4}
        wrap='wrap'
        mb={4}
      >
        {user?.rol === 'Superadmin' && (
          <Flex align='center' gap={2}>
            <Text fontWeight='medium'>Empresa:</Text>
            <Select
              onChange={(e) => setEmpresa(e.target.value)}
              name='empresa'
              size='sm'
              borderRadius='md'
              value={empresa}
              cursor='pointer'
              w='fit-content'
              borderColor='gray.300'
            >
              <option value='dodoLink'>dodoLink</option>
              <option value='Grupo IN'>Grupo IN</option>
            </Select>
          </Flex>
        )}

        <Flex align='center' gap={2}>
          <Text fontWeight='medium'>Pack:</Text>
          <Select
            onChange={(e) => setPack(e.target.value)}
            name='pack'
            size='sm'
            borderRadius='md'
            placeholder='Seleccionar pack'
            value={pack}
            cursor='pointer'
            w='fit-content'
            borderColor='gray.300'
          >
            {allPacks?.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex align='center' gap={2}>
          <Text fontWeight='medium'>Categoría:</Text>

          <Select
            placeholder='Todas'
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            size='sm'
            w='auto'
          >
            <option value='insumos'>Insumos</option>
            <option value='herramientas'>Herramientas</option>
          </Select>
        </Flex>

        <Flex align='center' gap={2}>
          <Text fontWeight='medium'>Buscar:</Text>
          <Input
            size='sm'
            maxW='200px'
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            placeholder='Ingresar nombre'
            borderRadius='md'
            borderColor='gray.300'
          />
        </Flex>

        <Text fontSize='sm' alignSelf='center'>
          Resultados: <b>{filteredProductos.length}</b>
        </Text>
      </Flex>

      <PaginationControl
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        show={filteredProductos.length > itemsPerPage}
      />
      {loadingProductos && !productos ? (
        <Flex w='100%' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color={loadingColor}
            height='100px'
            width='50px'
          />
        </Flex>
      ) : paginatedProductos.length > 0 ? (
        <TableContainer p={[1, 2, 3, 4, 5]}>
          <Table
            fontSize='sm'
            size={['xs', 'xs', 'xs', 'sm', 'sm']}
            variant='striped'
            colorScheme='facebook'
            minWidth='600px'
          >
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Cant.</Th>
                <Th>Packs</Th>
                <Th>Stock</Th>
                <Th>Target</Th>
                {user?.rol === 'Superadmin' && <Th></Th>}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedProductos
                ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((p) => {
                  const {
                    nombre,
                    target,
                    cantidadPorPack,
                    cantidad,
                    medida,
                    id,
                  } = p;
                  return (
                    <Tr key={id}>
                      <Td maxW='250px' overflow='hidden' whiteSpace='nowrap'>
                        <Text
                          isTruncated
                          title={nombre}
                          maxW='100%'
                          fontSize='sm'
                        >
                          {nombre}
                        </Text>
                      </Td>
                      <Td fontSize='md'>
                        <AnimatePresence mode='wait' initial={false}>
                          <motion.div
                            key={cantidad}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ dutaion: 0.25 }}
                          >
                            <b>{cantidad}</b> ({medida})
                          </motion.div>
                        </AnimatePresence>
                      </Td>
                      <Td>
                        {cantidadPorPack > 1
                          ? Number((cantidad / cantidadPorPack).toFixed(2)) / 1
                          : '-'}
                      </Td>
                      <Td>
                        {cantidad > 0 ? (
                          <MdCheckBox
                            style={{ marginLeft: '5px' }}
                            color='green'
                          />
                        ) : (
                          <MdCancel style={{ marginLeft: '5px' }} color='red' />
                        )}
                      </Td>
                      <Td>{target}</Td>
                      {user?.rol === 'Superadmin' && (
                        <Td>
                          <Flex align='center' gap={1}>
                            <ProductoModal
                              isIcon
                              updateProducto={updateProductoAndFront}
                              size='2xs'
                              producto={p}
                              allPacks={allPacks || []}
                              // setNewProducto={}
                            />
                            <DeleteModal
                              textContent={<MdDelete />}
                              title='Producto'
                              nombre={nombre}
                              size='sm'
                              loadingForm={loading}
                              DeleteProp={() => deleteProducto(id)}
                              isIcon
                            />
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text fontStyle='italic' p={[1, 2, 3, 4, 5]}>
          No se encontraron productos
        </Text>
      )}
    </Flex>
  );
};

export default ListadoProductos;
