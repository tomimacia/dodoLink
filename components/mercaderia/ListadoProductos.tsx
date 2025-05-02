import { useUser } from '@/context/userContext';
import { addDots } from '@/helpers/addDots';
import useGetProductos from '@/hooks/data/useGetProductos';
import {
  Button,
  Flex,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdCancel, MdCheckBox, MdDelete } from 'react-icons/md';
import ReactLoading from 'react-loading';
import ProductoModal from './Editar/ProductoModal';
import { ProductoType } from '@/types/types';
import DeleteModal from '../DeleteModal';
import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { sendContactForm } from '@/nodemailer/contact';
import dateTexto from '@/helpers/dateTexto';
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
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const updateProductoAndFront = async (
    productoID: string,
    newProduct: ProductoType
  ) => {
    await updateProducto(productoID, newProduct);
    const newProductos = productos?.map((p) => {
      if (p.id === productoID) return newProduct;
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
  const filterProductos = (productos: ProductoType[] | null) => {
    if (!productos) return [];
    return productos.filter((p) => p.empresa === empresa);
  };
  // const [loadingMail, setLoadingMail] = useState(false);

  // const test = async ({
  //   name,
  //   quantity,
  //   target,
  // }: {
  //   name: string;
  //   quantity: number;
  //   target: number;
  // }) => {
  //   setLoadingMail(true);
  //   try {
  //     await sendContactForm({
  //       productName: name,
  //       currentQuantity: quantity,
  //       targetQuantity: target,
  //     });
  //     toast({
  //       title: 'Exito',
  //       isClosable: true,
  //       duration: 5000,
  //       status: 'success',
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Error al enviar correo',
  //       isClosable: true,
  //       duration: 5000,
  //       status: 'error',
  //     });
  //     console.error(error);
  //   } finally {
  //     setLoadingMail(false);
  //   }
  // };
  return (
    <Flex flexDir='column' gap={3} mt={3}>
      <Flex gap={2}>
        <Button
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={getProductos}
          isLoading={loadingProductos}
        >
          Actualizar
        </Button>
        {user?.rol === 'Superadmin' && (
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
            <option value='Solunet'>Solunet</option>
          </Select>
        )}
      </Flex>
      {loadingProductos ? (
        <Flex w='100%' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color='#333c87'
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
                <Th>Target</Th>
                <Th>Packs</Th>
                <Th>Medida</Th>
                <Th>Stock</Th>
                {user?.rol === 'Superadmin' && <Th></Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filterProductos(productos)
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
                      <Td>{nombre}</Td>
                      <Td fontSize='md'>
                        <b>{cantidad}</b>
                      </Td>
                      <Td>{target}</Td>
                      <Td>
                        {cantidadPorPack > 1
                          ? Number((cantidad / cantidadPorPack).toFixed(2)) / 1
                          : '-'}
                      </Td>
                      <Td>{medida}</Td>
                      <Td>
                        {cantidad > 0 ? (
                          <MdCheckBox
                            style={{ marginLeft: '5px' }}
                            color='green'
                          />
                        ) : (
                          <MdCancel style={{ marginLeft: '5px' }} color='red' />
                        )}
                      </Td>{' '}
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
