import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import {
  checkSecretPasswordMatch,
  encryptPassword,
} from '@/helpers/CryptoJS/encryptation';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Input, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';

const HandleLoginAuthAdmin = ({
  isMatched,
  setIsMatched,
}: {
  isMatched: boolean;
  setIsMatched: (value: boolean) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(false);
  const { refreshUser } = useUser();
  const inputRef = useRef<any>();
  const toast = useToast();
  const verify = async () => {
    if (!inputValue) return;
    if (inputValue.length < 6) {
      return toast({
        title: 'Error',
        description: 'Ingresa una contraseña válida',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoadingSecret(true);
    try {
      const { adminPassword } = (await getSingleDoc(
        'users',
        'metadata'
      )) as any;

      const matchPassword = adminPassword === inputValue;
      setIsMatched(matchPassword);
      if (!matchPassword) {
        return toast({
          title: 'Error',
          description: 'Contraseña válida',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const encrypted = encryptPassword(inputValue);
        window.localStorage.setItem('PWDCJS_ADMIN_LOCAL_STORAGE', encrypted);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoadingSecret(false);
      }, 1000);
    }
  };
  const checkInital = async () => {
    setLoadingSecret(true);
    try {
      const matchPassword = await checkSecretPasswordMatch();
      setIsMatched(matchPassword);
      if (isMatched) refreshUser();
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoadingSecret(false);
      }, 1000);
    }
  };
  useEffect(() => {
    if (!isMatched) checkInital();
  }, []);
  const onKeyDown = useEnter(inputRef, verify);
  return (
    <Flex
      borderRadius='10px'
      p={[4, 6, 8, 10]}
      py={[2, 3, 4, 5]}
      gap={2}
      flexDir='column'
      bg='transparent'
      border='2px solid rgba(255, 255, 255, .2)'
      backdropFilter='blur(20px)'
      boxShadow='0 0 10px rgba(0, 0, 0, .4)'
      w='85%'
    >
      <Heading size='md' mx='auto' color='white'>
        Autenticación Admin
      </Heading>
      {loadingSecret && (
        <Flex maxW='400px' justify='center'>
          <ReactLoading type='bubbles' color='white' />
        </Flex>
      )}
      {!loadingSecret &&
        (!isMatched ? (
          <>
            <Input
              required
              color='black'
              placeholder='Contraseña'
              type='password'
              onChange={(e) => setInputValue(e.target.value)}
              mb={2}
              ref={inputRef}
              onKeyDown={onKeyDown}
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
              autoComplete='off'
              size={['xs', 'xs', 'sm', 'sm']}
            />
            <Button
              w='100%'
              h='36px'
              mt={2}
              mb={2}
              bg='blue.600'
              color='white'
              _hover={{ bg: 'gray.400' }}
              borderRadius='7px'
              fontSize='10pt'
              fontWeight='700'
              boxShadow='0 0 10px rgba(0, 0, 0, .5)'
              _focus={{ boxShadow: 'none' }}
              isLoading={loadingSecret}
              onClick={verify}
              size='sm'
            >
              Verificar
            </Button>
          </>
        ) : (
          <Flex
            fontWeight='bold'
            bg='green.600'
            color='white'
            p={2}
            borderRadius={5}
            align='center'
            gap={2}
          >
            <Text>Autenticado</Text>
            <CheckCircleIcon />
          </Flex>
        ))}
    </Flex>
  );
};

export default HandleLoginAuthAdmin;
