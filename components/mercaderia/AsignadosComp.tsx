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
import React, { useState } from 'react';
import ReactLoading from 'react-loading';

const AsignadosComp = () => {
  const { users, loadingUserList, getUsers } = useGetUsers();
  const [cuadrilla, setCuadrilla] = useState(false);
  // Filtramos solo los usuarios que tienen inventario
  const usersWithInventory = users?.filter((u) => {
    const hasInventario = u.inventario && u.inventario.length > 0;
    const isCuadrilla = cuadrilla ? u?.rol === 'Cuadrilla' : true;
    return hasInventario && isCuadrilla;
  });

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
          <FormLabel cursor='pointer' htmlFor='cuadrilla-switch' mb='0' fontSize='sm'>
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
      ) : usersWithInventory?.length ? (
        <Flex maxW='450px' direction='column' gap={4}>
          {usersWithInventory.map((u) => (
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
              <Flex direction='column' gap={1}>
                {u.inventario.map((p, idx) => (
                  <Text key={`${u.id}-${idx}`} fontSize='sm'>
                    {p.nombre} — {p.cantidad} {p.medida}
                  </Text>
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>
      ) : (
        <Text fontStyle='italic' color='gray.500'>
          No hay resultados para mostrar.
        </Text>
      )}
    </Flex>
  );
};

export default AsignadosComp;
