import { sendMailAndTelegram } from '@/alerts/sendMailAndTelegram';
import { useUser } from '@/context/userContext';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { updateProductosLastStamp } from '@/helpers/updateStamps';
import useGetProductos from '@/hooks/data/useGetProductos';
import useGetUsers from '@/hooks/users/useGetUsers';
import { ProductoType, UserType } from '@/types/types';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import EditarProductoModal from './Editar/EditarProductoModal';
import EditarInventarioModal from './Editar/EditarInventarioModal';
import AgregarProductoAsignado from './Editar/AgregarProductoAsignado';

const AsignadosComp = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { users, loadingUserList, getUsers } = useGetUsers();
  useEffect(() => {
    getUsers();
  }, []);
  const { productos, setProductos, checkUpdates } = useGetProductos();
  const [cuadrilla, setCuadrilla] = useState(false);
  // Filtramos solo los usuarios que tienen inventario
  const usersForMapping = users
    ?.filter((u) => {
      const show = u?.rol === 'Cuadrilla' || u?.rol === 'Superadmin';
      return show;
    })
    .sort((a, b) => b.inventario.length - a.inventario.length);
  // const updateInventarioOld = async (
  //   user: UserType,
  //   newInventario: ProductoType[],
  //   ajustarStock: boolean
  // ) => {
  //   setLoading(true);
  //   try {
  //     const finalInventario = newInventario.filter((p) => p.cantidad > 0);
  //     await setSingleDoc('users', user.id, { inventario: finalInventario });

  //     // RESTAR stock por aumento o producto nuevo
  //     const addPromises = newInventario
  //       .map((p) => {
  //         const oldItem = user.inventario.find((i) => i.id === p.id);
  //         const DBItem = productos?.find((db) => db.id === p.id);
  //         if (!DBItem) return null;

  //         const oldCant = oldItem?.cantidad ?? 0;
  //         const diff = p.cantidad - oldCant;
  //         if (diff > 0) {
  //           return setSingleDoc('productos', p.id, {
  //             cantidad: DBItem.cantidad - diff,
  //           });
  //         }
  //         return null;
  //       })
  //       .filter(Boolean);
  //     // SUMAR stock si se redujo cantidad o se eliminó un producto

  //     const subPromises = ajustarStock
  //       ? user.inventario
  //           .map((oldP) => {
  //             const newP = newInventario.find((p) => p.id === oldP.id);
  //             const newCant = newP?.cantidad ?? 0;
  //             const diff = oldP.cantidad - newCant;
  //             if (diff > 0) {
  //               const DBItem = productos?.find((pDB) => pDB.id === oldP.id);

  //               if (!DBItem) return null;
  //               return setSingleDoc('productos', oldP.id, {
  //                 cantidad: DBItem.cantidad + diff,
  //               });
  //             }
  //             return null;
  //           })
  //           .filter(Boolean)
  //       : [];

  //     // Actualización local
  //     const productosActualizados = productos?.map((p) => {
  //       const oldItem = user.inventario.find((oldP) => oldP.id === p.id);
  //       const newItem = newInventario.find((newP) => newP.id === p.id);

  //       if (oldItem && !newItem) {
  //         return ajustarStock
  //           ? { ...p, cantidad: p.cantidad + oldItem.cantidad }
  //           : p;
  //       }

  //       if (!oldItem && newItem) {
  //         return { ...p, cantidad: p.cantidad - newItem.cantidad };
  //       }

  //       if (oldItem && newItem) {
  //         const diff = newItem.cantidad - oldItem.cantidad;
  //         if (diff > 0) return { ...p, cantidad: p.cantidad - diff };
  //         if (diff < 0 && ajustarStock)
  //           return { ...p, cantidad: p.cantidad + Math.abs(diff) };
  //       }

  //       return p;
  //     });

  //     const promisesFinal = [...addPromises, ...subPromises];
  //     await Promise.all(promisesFinal);

  //     if (promisesFinal.length > 0) updateProductosLastStamp();

  //     if (productosActualizados) {
  //       setProductos(productosActualizados);

  //       const productosBajoStock = productosActualizados.filter((p) => {
  //         return (
  //           p.target > 0 &&
  //           p.cantidad <= p.target &&
  //           newInventario.some((invItem) => invItem.id === p.id)
  //         );
  //       });
  //       if (productosBajoStock.length > 0) {
  //         sendMailAndTelegram(productosBajoStock);
  //       }
  //     }
  //     await getUsers();
  //   } catch (e: any) {
  //     console.error(e.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const agregarProductos = async (
    user: UserType,
    newInventario: ProductoType[]
  ) => {
    setLoading(true);
    try {
      const finalInventario = [...user.inventario, ...newInventario];
      await setSingleDoc('users', user.id, { inventario: finalInventario });

      // RESTAR stock por aumento o producto nuevo
      const addPromises = newInventario
        .map((p) => {
          const DBItem = productos?.find((db) => db.id === p.id);
          if (!DBItem) return false;
          if (p.cantidad > 0) {
            return setSingleDoc('productos', p.id, {
              cantidad: DBItem.cantidad - p.cantidad,
            });
          }
          return false;
        })
        .filter(Boolean);
      // Actualización local
      const productosActualizados = newInventario?.map((p) => {
        const oldItem = productos?.find((oldP) => oldP.id === p.id);
        if (!oldItem) return p;
        return { ...p, cantidad: oldItem?.cantidad - p.cantidad };
      });

      await Promise.all(addPromises);

      if (addPromises.length > 0) updateProductosLastStamp();

      if (productosActualizados) {
        const newProductos = productos?.map((p) => {
          const newP = productosActualizados.find((np) => np.id === p.id);
          return newP || p;
        });
        if (newProductos) setProductos(newProductos);

        const productosBajoStock = productosActualizados.filter((p) => {
          return (
            p.target > 0 &&
            p.cantidad <= p.target &&
            // Esto creo que no va VV
            newInventario.some((invItem) => invItem.id === p.id)
          );
        });
        if (productosBajoStock.length > 0) {
          sendMailAndTelegram(productosBajoStock);
        }
      }
      await getUsers();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateInventarioProducto = async (
    user: UserType,
    productoId: string,
    nuevaCantidadUsuario: number,
    devolverStock: boolean,
    FirstDBItem: any
  ) => {
    setLoading(true);
    try {
      let DBItem: ProductoType = FirstDBItem;
      const oldItem = user.inventario.find((p) => p.id === productoId);
      if (!oldItem) throw new Error('Producto no encontrado en stock global');
      if (!FirstDBItem) {
        DBItem = { ...oldItem, cantidad: 0 };
      }
      const oldCantidad = oldItem?.cantidad ?? 0;

      // Actualizamos el inventario del usuario en memoria
      const nuevoInventarioUsuario = [...user.inventario];
      if (nuevaCantidadUsuario > 0) {
        const index = nuevoInventarioUsuario.findIndex(
          (p) => p.id === productoId
        );
        if (index >= 0) {
          nuevoInventarioUsuario[index].cantidad = nuevaCantidadUsuario;
        } else {
          nuevoInventarioUsuario.push({
            ...DBItem,
            cantidad: nuevaCantidadUsuario,
          });
        }
      } else {
        // Si la cantidad es 0, eliminar el producto del inventario del usuario
        const index = nuevoInventarioUsuario.findIndex(
          (p) => p.id === productoId
        );
        if (index >= 0) nuevoInventarioUsuario.splice(index, 1);
      }

      // Guardamos inventario del usuario
      await setSingleDoc('users', user.id, {
        inventario: nuevoInventarioUsuario,
      });

      // Ajuste en el stock del depósito
      const diff = nuevaCantidadUsuario - oldCantidad;

      if (diff > 0) {
        // Usuario recibe más → restar del depósito
        await setSingleDoc('productos', productoId, {
          cantidad: DBItem.cantidad - diff,
        });
      } else if (diff < 0 && devolverStock) {
        // Usuario devuelve → sumar al depósito
        await setSingleDoc('productos', productoId, {
          cantidad: DBItem.cantidad + Math.abs(diff),
        });
      }

      // Actualizamos en memoria `productos`
      const newProductos = productos?.map((p) =>
        p.id === productoId
          ? {
              ...p,
              cantidad:
                diff > 0
                  ? p.cantidad - diff
                  : diff < 0 && devolverStock
                  ? p.cantidad + Math.abs(diff)
                  : p.cantidad,
            }
          : p
      );
      if (newProductos) setProductos(newProductos);

      // Chequeo de bajo stock SOLO para este producto
      const nuevoStock =
        diff > 0
          ? DBItem.cantidad - diff
          : diff < 0 && devolverStock
          ? DBItem.cantidad + Math.abs(diff)
          : DBItem.cantidad;
      if (DBItem.target > 0 && nuevoStock <= DBItem.target) {
        sendMailAndTelegram([{ ...DBItem, cantidad: nuevoStock }]);
      }

      updateProductosLastStamp();
      await getUsers();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex flexDir='column' gap={4}>
      <Heading size='md'>Productos Asignados</Heading>
      <Flex align='center' flexWrap='wrap' gap={4}>
        <Button
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={getUsers}
          disabled={loadingUserList}
        >
          Actualizar
        </Button>

        <FormControl
          boxShadow='0 0 3px'
          borderRadius={5}
          p={2}
          display='flex'
          alignItems='center'
          w='fit-content'
        >
          <FormLabel
            cursor='pointer'
            htmlFor='cuadrilla-switch'
            mb='0'
            fontSize='sm'
          >
            Solo Cuadrilla
          </FormLabel>
          <Switch
            id='cuadrilla-switch'
            isChecked={cuadrilla}
            onChange={() => setCuadrilla((prev) => !prev)}
            colorScheme='blue'
          />
        </FormControl>
      </Flex>
      {loadingUserList && users === null ? (
        <Flex justify='center' align='center' minH='150px'>
          <ReactLoading type='bars' color='#3182ce' height={40} width={40} />
        </Flex>
      ) : (
        <Flex w='fit-content' direction='column' gap={4}>
          {usersForMapping?.map((u) => (
            <Box
              key={u.id}
              border='1px solid'
              borderColor='gray.300'
              borderRadius='lg'
              p={4}
              boxShadow='md'
              bg='gray.50'
              _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
              borderWidth={1}
            >
              <Text fontWeight='bold' fontSize='lg'>
                {u.nombre} {u.apellido}
              </Text>
              <Text fontSize='sm' color='gray.500'>
                {u.rol}
              </Text>
              <Divider my={2} />
              <Flex mb={8} direction='column' gap={2}>
                {u.inventario.map((p, idx) => {
                  const productoDB = productos?.find((pDB) => p.id === pDB.id);
                  return (
                    <Flex
                      gap={4}
                      justify='space-between'
                      fontSize='sm'
                      key={`${u.id}-${idx}-${p.nombre}`}
                      pb='2px'
                      borderBottom='1px solid #DCE4EB'
                    >
                      <Text>{p.nombre}</Text>
                      <Flex minW='50px' align='center' gap={1}>
                        <Text textAlign='right'>
                          {p.cantidad} {p.medida}
                        </Text>
                        {(user?.rol === 'Superadmin' ||
                          user?.rol === 'Supervisor') && (
                          <EditarProductoModal
                            user={u}
                            producto={p}
                            productoDB={productoDB}
                            updateInventario={(
                              user: UserType,
                              productoId: string,
                              nuevaCantidadUsuario: number,
                              devolverStock: boolean
                            ) =>
                              updateInventarioProducto(
                                user,
                                productoId,
                                nuevaCantidadUsuario,
                                devolverStock,
                                productoDB
                              )
                            }
                            loading={loading}
                            checkUpdates={checkUpdates}
                          />
                        )}
                      </Flex>
                    </Flex>
                  );
                })}
                {u.inventario.length === 0 && (
                  <Text color='gray.500'>Sin productos asignados</Text>
                )}
              </Flex>
              {(user?.rol === 'Superadmin' || user?.rol === 'Supervisor') && (
                <AgregarProductoAsignado
                  allProductos={productos || []}
                  user={u}
                  updateInventario={agregarProductos}
                  loading={loading}
                  checkUpdates={checkUpdates}
                />
              )}
              {/* {(user?.rol === 'Superadmin' || user?.rol === 'Supervisor') && (
                <EditarInventarioModal
                  allProductos={productos || []}
                  user={u}
                  updateInventario={updateInventario}
                  loading={loading}
                  checkUpdates={checkUpdates}
                />
              )} */}
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default AsignadosComp;
