import {
  decryptPassword,
  encryptPassword,
} from '@/helpers/CryptoJS/encryptation';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { useLocalStorage } from '@/hooks/storageHooks/useLocalStorage';
import { Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
const RaspberryLogin = ({
  setAccess,
}: {
  setAccess: (access: boolean) => void;
}) => {
  const [password, setPassword] = useLocalStorage(
    'RASPBERRYPI_PASSWORD_STORAGE',
    ''
  );
  const valueRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const customPassword = process.env.NEXT_PUBLIC_CUSTOMACCESS_RASPBERRYPI || '';
  const onSubmit = () => {
    const encrypted = encryptPassword(inputValue);
    setPassword(encrypted);
  };
  const toast = useToast();
  useEffect(() => {
    setTimeout(() => {
      valueRef.current?.focus();
    }, 100);
  }, [inputValue]);
  useEffect(() => {
    if (!password) return;
    if (decryptPassword(password) !== customPassword) {
      setError('Contraseña incorrecta');
      setTimeout(() => {
        setError('');
        setInputValue('');
      }, 3000);
    } else {
      setAccess(true);
      toast({
        title: 'Acceso permitido',
        description: 'Comienza a usar el sistema de ingresos',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [password]);
  const onKeyDown = useEnter(valueRef, onSubmit);
  return (
    <Center
      border={`1px solid ${error ? 'red' : 'transparent'}`}
      p={3}
      borderRadius={5}
      gap={3}
      my='auto'
      flexDir='column'
      mx='auto'
      maxW='400px'
    >
      <Text fontSize='2xl' fontWeight='bold'>
        Ingresar Contraseña
      </Text>
      <Flex flexDir='column'>
        <Input
          borderColor='gray'
          autoFocus
          ref={valueRef}
          onKeyDown={onKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Ingresar contraseña'
          borderRadius='5px'
          maxW='220px'
          size='lg'
          type='password'
          autoComplete='off'
          formNoValidate
        />
        {error ? (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            style={{ height: '15px' }}
          >
            <Text color='red.500'>{error}</Text>
          </motion.div>
        ) : (
          <Flex h='15px' />
        )}
      </Flex>
      <Button
        _hover={{ opacity: 0.65 }}
        size='md'
        onClick={onSubmit}
        bg='blue.300'
      >
        Aceptar
      </Button>
    </Center>
  );
};

export default RaspberryLogin;
