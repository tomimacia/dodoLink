import useGetUsers from '@/hooks/users/useGetUsers';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
const AsignarPedido = ({
  asignarPedidoPendiente,
}: {
  asignarPedidoPendiente: (userID: string) => Promise<void>;
}) => {
  const { users } = useGetUsers();
  const [loading, setLoading] = useState(false);
  const selectedUsers = users?.filter((u) =>
    ['Cuadrilla', 'Superadmin'].includes(u?.rol)
  );
  const asignarPedido = async (userID: string) => {
    setLoading(true);
    try {
      await asignarPedidoPendiente(userID);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Menu isLazy>
      <MenuButton
        my={1}
        w='fit-content'
        as={Button}
        size='sm'
        isLoading={loading}
        isDisabled={loading}
        bg='gray.700'
        color='white'
        _dark={{ bg: 'white', color: 'black' }}
        _hover={{ bg: 'gray.800' }}
      >
        Asignar Reserva
      </MenuButton>
      <MenuList p={3} boxShadow='lg'>
        {selectedUsers?.map((user) => {
          return (
            <MenuItem
              onClick={() => asignarPedido(user.id)}
              my={1}
              borderRadius='lg'
              bg='gray.700'
              color='white'
              _hover={{ opacity: 0.7 }}
            >
              {user.nombre} {user.apellido}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default AsignarPedido;
