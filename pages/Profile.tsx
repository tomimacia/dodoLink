import SuperAdminRoutes from '@/components/users/SuperAdminRoutes';
import UserBody from '@/components/users/UserBody';
import { useUser } from '@/context/userContext';
import { Flex, Heading } from '@chakra-ui/react';
import ReactLoading from 'react-loading';
const Profile = () => {
  const { user, loading } = useUser();
  if (loading)
    return (
      <Flex maxW='700px' my={10} justify='center'>
        <ReactLoading type='bars' color='#333c87' height='100px' width='50px' />
      </Flex>
    );
  return (
    <Flex w='100%' flexDir='column'>
      <Heading textAlign='center'>Mi Perfil</Heading>
      <UserBody user={user} />
      {user?.rol === 'Superadmin' && <SuperAdminRoutes />}
    </Flex>
  );
};

export default Profile;
