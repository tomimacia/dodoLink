import { auth } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { useLocalStorage } from '@/hooks/storageHooks/useLocalStorage';
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import ForgotPasswordModal from './ForgotPasswordModal';
const LoginFormAndScreens = ({
  refreshUser,
}: {
  refreshUser: () => Promise<void>;
}) => {
  const [recuerdameUser, setRecuerdameUser] = useLocalStorage(
    'RECUERDAME_USER_STORAGE',
    ''
  );
  const [recuerdameUserPwd, setRecuerdamePwd] = useLocalStorage(
    'RECUERDAME_PASSWORD_STORAGE',
    ''
  );
  const [loginForm, setLoginForm] = useState({
    email: recuerdameUser,
    password: recuerdameUserPwd,
  });
  const [signInWithEmailAndPassword, firebaseUser, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!isMatched) {
    //   return toast({
    //     title: 'Error',
    //     description: 'Admin no autenticado',
    //     status: 'error',
    //     duration: 9000,
    //     isClosable: true,
    //   });
    // }
    // if (firebaseUser) {
    //   refreshUser();
    //   return;
    // }
    await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    await refreshUser();
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onChangeCheckbox = (e: any) => {
    if (e.target.checked) {
      setRecuerdameUser(loginForm.email);
      setRecuerdamePwd(loginForm.password);
    } else {
      setRecuerdameUser('');
      setRecuerdamePwd('');
      setLoginForm({
        email: '',
        password: '',
      });
    }
  };
  return (
    <Flex
      h='100%'
      w='100%'
      maxW='600px'
      alignSelf='center'
      align='center'
      mx='auto'
      flexDir='column'
      justify='center'
      gap={4}
    >
      <Image
        alt='dodolink-banner'
        width={450}
        height={'auto'}
        top={20}
        src='/Hlogo.png'
        pos='absolute'
        boxShadow='0 0 10px black'
        maxWidth='85%'
        borderRadius='10px'
        bg='whiteAlpha.200'
        style={{
          backdropFilter: 'blur(10px)',
        }}
      />
      <Flex
        borderRadius='10px'
        p={[4, 6, 8, 10]}
        gap={2}
        flexDir='column'
        bg='blackAlpha.700'
        border='2px solid rgba(255, 255, 255, .2)'
        backdropFilter='blur(20px)'
        boxShadow='0 0 10px rgba(0, 0, 0, .4)'
        w='85%'
      >
        <Heading size='lg' mx='auto' color='white'>
          Iniciar sesión
        </Heading>
        <form onSubmit={onSubmit}>
          <Input
            required
            color='black'
            name='email'
            placeholder='Email'
            type='email'
            value={loginForm.email}
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{ color: 'gray.500' }}
            _hover={{
              bg: 'white',
              border: '1px solid',
              borderColor: 'gray.500',
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              border: '1px solid',
              borderColor: 'gray.500',
            }}
            bg='gray.50'
            size={['sm', 'sm', 'md', 'md']}
            autoComplete='off'
          />
          <Input
            required
            color='black'
            name='password'
            placeholder='Contraseña'
            type='password'
            onChange={onChange}
            mb={2}
            value={loginForm.password}
            fontSize='10pt'
            _placeholder={{ color: 'gray.500' }}
            _hover={{
              bg: 'white',
              border: '1px solid',
              borderColor: 'gray.500',
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              border: '1px solid',
              borderColor: 'gray.500',
            }}
            bg='gray.50'
            size={['sm', 'sm', 'md', 'md']}
            autoComplete='off'
          />
          <Checkbox
            color='white'
            size={['sm', 'sm', 'md', 'md']}
            defaultChecked={Boolean(recuerdameUser && recuerdameUserPwd)}
            onChange={onChangeCheckbox}
          >
            Recuerdame
          </Checkbox>
          <Button
            type='submit'
            w='100%'
            h='36px'
            mt={2}
            mb={2}
            bg='blue.500'
            color='white'
            _hover={{ bg: 'blue.400' }}
            borderRadius='7px'
            fontSize='10pt'
            fontWeight='700'
            boxShadow='0 0 10px rgba(0, 0, 0, .5)'
            _focus={{ boxShadow: 'none' }}
            isLoading={loading}
            size={['sm', 'sm', 'md', 'md']}
          >
            Ingresar
          </Button>
          <ForgotPasswordModal />
          <Text
            borderRadius='4px'
            textAlign='center'
            color='red.400'
            fontSize={16}
            mt={3}
          >
            {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
          </Text>
        </form>
      </Flex>
    </Flex>
  );
};

export default LoginFormAndScreens;
