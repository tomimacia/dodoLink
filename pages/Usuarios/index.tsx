import UserList from '@/components/users/UserList';
import useGetUsers from '@/hooks/users/useGetUsers';
import { Button } from '@chakra-ui/react';
const Usuarios = () => {
  const { users, loadingUserList, setUsers, getUsers } = useGetUsers();
  return (
    <>
      <Button
        bg='gray.600'
        color='white'
        w='fit-content'
        size='sm'
        _hover={{ opacity: 0.65 }}
        onClick={getUsers}
      >
        Actualizar
      </Button>
      <UserList
        setUsers={setUsers}
        users={users || []}
        loadingUserList={loadingUserList}
      />
    </>
  );
};

export default Usuarios;
