import useGetUsers from '@/hooks/users/useGetUsers';
import {
  Flex,
  Heading,
  Text,
  Box,
  Divider,
  Button,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import EditarInventarioModal from './Editar/EditarInventarioModal';
import useGetProductos from '@/hooks/data/useGetProductos';
import { ProductoType, UserType } from '@/types/types';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { useUser } from '@/context/userContext';
import { sendMailAndTelegram } from '@/alerts/sendMailAndTelegram';
import { updateProductosLastStamp } from '@/helpers/updateStamps';

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
  const updateInventario = async (
    user: UserType,
    newInventario: ProductoType[],
    ajustarStock: boolean
  ) => {
    setLoading(true);
    try {
      const finalInventario = newInventario.filter((p) => p.cantidad > 0);
      await setSingleDoc('users', user.id, { inventario: finalInventario });

      // RESTAR stock por aumento o producto nuevo
      const addPromises = newInventario
        .map((p) => {
          const oldItem = user.inventario.find((i) => i.id === p.id);
          const DBItem = productos?.find((db) => db.id === p.id);
          if (!DBItem) return null;

          const oldCant = oldItem?.cantidad ?? 0;
          const diff = p.cantidad - oldCant;
          if (diff > 0) {
            return setSingleDoc('productos', p.id, {
              cantidad: DBItem.cantidad - diff,
            });
          }
          return null;
        })
        .filter(Boolean);
      // SUMAR stock si se redujo cantidad o se eliminó un producto

      const subPromises = ajustarStock
        ? user.inventario
            .map((oldP) => {
              const newP = newInventario.find((p) => p.id === oldP.id);
              const newCant = newP?.cantidad ?? 0;
              const diff = oldP.cantidad - newCant;
              if (diff > 0) {
                const DBItem = productos?.find((pDB) => pDB.id === oldP.id);

                if (!DBItem) return null;
                return setSingleDoc('productos', oldP.id, {
                  cantidad: DBItem.cantidad + diff,
                });
              }
              return null;
            })
            .filter(Boolean)
        : [];

      // Actualización local
      const productosActualizados = productos?.map((p) => {
        const oldItem = user.inventario.find((oldP) => oldP.id === p.id);
        const newItem = newInventario.find((newP) => newP.id === p.id);

        if (oldItem && !newItem) {
          return ajustarStock
            ? { ...p, cantidad: p.cantidad + oldItem.cantidad }
            : p;
        }

        if (!oldItem && newItem) {
          return { ...p, cantidad: p.cantidad - newItem.cantidad };
        }

        if (oldItem && newItem) {
          const diff = newItem.cantidad - oldItem.cantidad;
          if (diff > 0) return { ...p, cantidad: p.cantidad - diff };
          if (diff < 0 && ajustarStock)
            return { ...p, cantidad: p.cantidad + Math.abs(diff) };
        }

        return p;
      });

      const promisesFinal = [...addPromises, ...subPromises];
      await Promise.all(promisesFinal);

      if (promisesFinal.length > 0) updateProductosLastStamp();

      if (productosActualizados) {
        setProductos(productosActualizados);

        const productosBajoStock = productosActualizados.filter((p) => {
          return (
            p.target > 0 &&
            p.cantidad <= p.target &&
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
      {loadingUserList ? (
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
              _dark={{ bg: 'gray.800', borderColor: 'gray.600' }}
            >
              <Text fontWeight='bold' fontSize='lg'>
                {u.nombre} {u.apellido}
              </Text>
              <Text fontSize='sm' color='gray.500'>
                {u.rol}
              </Text>
              <Divider my={2} />
              <Flex mb={8} direction='column' gap={1}>
                {u.inventario.map((p, idx) => (
                  <Flex
                    gap={4}
                    justify='space-between'
                    fontSize='sm'
                    key={`${u.id}-${idx}`}
                    pb='2px'
                    borderBottom='1px solid #DCE4EB'
                  >
                    <Text>{p.nombre}</Text>
                    <Text textAlign='right' minW='50px'>
                      {p.cantidad} {p.medida}
                    </Text>
                  </Flex>
                ))}
                {u.inventario.length === 0 && (
                  <Text color='gray.500'>Sin productos asignados</Text>
                )}
              </Flex>
              {(user?.rol === 'Superadmin' || user?.rol === 'Supervisor') && (
                <EditarInventarioModal
                  allProductos={productos || []}
                  user={u}
                  updateInventario={updateInventario}
                  loading={loading}
                  checkUpdates={checkUpdates}
                />
              )}
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default AsignadosComp;
