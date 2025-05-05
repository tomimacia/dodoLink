import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { RolType, UserType } from '@/types/types';
import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import ReactLoading from 'react-loading';
import EditUserRol from './EditUserRol';
import DeleteModal from '../DeleteModal';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { deleteUser } from '@/firebase/services/deleteUser';
import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const updateRol = async (id: string, rol: RolType) => {
    try {
      await setSingleDoc('users', id, {
        rol,
      });
      const newUsers = users.map((u) => {
        if (u.id === id) return { ...u, rol };
        return u;
      });
      setUsers(newUsers);
      toast({
        title: 'Éxito',
        description: 'Rol actualizado correctamente',
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
                          {u.rol}
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
                            <EditUserRol updateRol={updateRol} user={u} />
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
