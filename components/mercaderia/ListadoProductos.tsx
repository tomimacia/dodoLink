import { useUser } from '@/context/userContext';
import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import useGetProductos from '@/hooks/data/useGetProductos';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProductoType } from '@/types/types';
import {
  Button,
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
import { useEffect, useMemo, useState } from 'react';
import { MdCancel, MdCheckBox, MdDelete } from 'react-icons/md';
import ReactLoading from 'react-loading';
import DeleteModal from '../DeleteModal';
import ProductoModal from './Editar/ProductoModal';
import usePagination from '@/hooks/data/usePagination';
import PaginationControl from '../reservas/PaginationControl';
const ListadoProductos = () => {
  const {
    productos,
    loadingProductos,
    setProductos,
    getProductos,
    updateProducto,
  } = useGetProductos();
  useEffect(() => {
    if (productos?.length === 0) getProductos();
  }, []);
  const { loadingColor } = useThemeColors();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
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
  const deleteProducto = async (pID: string) => {
    setLoading(true);
    try {
      await deleteSingleDoc('productos', pID);
      const newProductos = productos?.filter((p) => p.id !== pID);
      if (newProductos) setProductos(newProductos);
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente',
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
  const itemsPerPage = 12;
  const filteredProductos = useMemo(() => {
    if (!productos) return [];
    return productos
      .filter((p) => {
        const isEmpresa = p.empresa === empresa;
        const matchesFilter =
          filterInput.length < 3 ||
          p?.nombre?.toLowerCase().includes(filterInput.toLowerCase());
        return isEmpresa && matchesFilter;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productos, empresa, filterInput]);
  const {
    paginatedArr: paginatedProductos,
    page,
    totalPages,
    handlePageChange,
  } = usePagination(filteredProductos, itemsPerPage, true);

  return (
    <Flex flexDir='column' gap={3} mt={3}>
      {user?.rol === 'Superadmin' && (
        <Flex align='center' gap={2}>
          <Text>Empresa:</Text>
          <Select
            onChange={(e) => setEmpresa(e.target.value)}
            name='tipo'
            required
            borderColor='gray'
            size='sm'
            borderRadius='5px'
            value={empresa}
            cursor='pointer'
            w='fit-content'
          >
            <option value='dodoLink'>dodoLink</option>
            <option value='Grupo IN'>Grupo IN</option>
          </Select>
        </Flex>
      )}
      <Text>Total: {filteredProductos.length}</Text>
      <Input
        borderColor='gray'
        size='sm'
        maxW='250px'
        onChange={(e) => setFilterInput(e.target.value)}
        borderRadius={5}
        placeholder='Ingresar nombre'
      />
      <PaginationControl
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        show={filteredProductos.length > itemsPerPage}
      />
      {loadingProductos ? (
        <Flex w='100%' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color={loadingColor}
            height='100px'
            width='50px'
          />
        </Flex>
      ) : (
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
                        <b>{cantidad}</b> ({medida})
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
                            {/* <Button
                              isLoading={loadingMail}
                              _hover={{ opacity: 0.65 }}
                              mt={2}
                              size='sm'
                              bg='blue.300'
                              onClick={() =>
                                test({
                                  name: p.nombre,
                                  quantity: p.cantidad,
                                  target,
                                })
                              }
                            >
                              Test Email
                            </Button> */}
                          </Flex>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Flex>
  );
};

export default ListadoProductos;
