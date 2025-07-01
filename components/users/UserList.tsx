import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { deleteUser } from '@/firebase/services/deleteUser';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { useThemeColors } from '@/hooks/useThemeColors';
import { RolType, UserType } from '@/types/types';
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import ReactLoading from 'react-loading';
import DeleteModal from '../DeleteModal';
import EditUserRol from './EditUserRol';

const UserList = ({
  users,
  loadingUserList,
  setUsers,
}: {
  users: UserType[];
  loadingUserList: boolean;
  setUsers: (newUsers: any) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const updateRolYCuadrilla = async (
    id: string,
    rol: RolType,
    cuadrilla: number | null
  ) => {
    try {
      await setSingleDoc('users', id, {
        rol,
        cuadrilla,
      });
      const newUsers = users.map((u) => {
        if (u.id === id) return { ...u, rol, cuadrilla };
        return u;
      });
      setUsers(newUsers);
      toast({
        title: 'Éxito',
        description: 'Usuario actualizado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const deleteUserAndDB = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      await deleteSingleDoc('users', id);
      const newUsers = users.filter((u) => u.id !== id);
      setUsers(newUsers);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const { loadingColor } = useThemeColors();

  return (
    <>
      {users.length > 0 && !loadingUserList && (
        <TableContainer maxW='700px' my={5}>
          <Table
            fontSize='sm'
            size='sm'
            variant='striped'
            colorScheme='facebook'
          >
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Nombre</Th>
                <Th>Rol</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users
                .filter(
                  (u) =>
                    u.id !== 'metadata' && u.email !== 'tomimacia@gmail.com'
                )
                .map((u, ind) => {
                  return (
                    <Tr key={`user-${u.nombre}-${ind}`}>
                      <Td> {u.email}</Td>
                      <Td>
                        <strong>{u.nombre}</strong>
                      </Td>
                      <Td>
                        <Flex align='center' gap={1} justify='space-between'>
                          {u.rol}{' '}
                          {u?.cuadrilla &&
                            u?.rol === 'Cuadrilla' &&
                            `(${u?.cuadrilla})`}
                          <Flex gap={1}>
                            <DeleteModal
                              textContent={<MdDelete />}
                              title='Usuario'
                              nombre={`${u.nombre} ${u.apellido}`}
                              size='sm'
                              loadingForm={loading}
                              DeleteProp={() => deleteUserAndDB(u.id)}
                              isIcon
                            />
                            <EditUserRol
                              updateRolYCuadrilla={updateRolYCuadrilla}
                              user={u}
                            />
                          </Flex>
                        </Flex>
                      </Td>
                      {/* <Td>
                      <Button
                        size='xs'
                        bg='blue.300'
                        _hover={{ bg: 'blue.100' }}
                      >
                        Eliminar
                      </Button>
                    </Td> */}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {loadingUserList && (
        <Flex maxW='700px' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color={loadingColor}
            height='100px'
            width='50px'
          />
        </Flex>
      )}
    </>
  );
};

export default UserList;
