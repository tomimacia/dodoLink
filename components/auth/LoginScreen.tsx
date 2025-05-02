import { useUser } from '@/context/userContext';
import { Flex } from '@chakra-ui/react';
import LoadingScreen from '../LoadingScreen';
import LoginFormAndScreens from './LoginFormAndScreens';

const LoginScreen = ({ refreshUser }: { refreshUser: () => Promise<void> }) => {
  const { loading } = useUser();
  return (
    <Flex width='100%' w='100%' h='100%' pos='fixed' flexDir='column'>
      <Flex
        bgImage='/LoginBG.jpg'
        bgSize='cover'
        bgPosition='center'
        pos='absolute'
        w='100%'
        h='100%'
      />
      {loading ? (
        <LoadingScreen />
      ) : (
        <LoginFormAndScreens refreshUser={refreshUser} />
      )}
    </Flex>
  );
};

export default LoginScreen;
