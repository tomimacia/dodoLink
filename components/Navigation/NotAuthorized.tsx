import { Button, Center, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { MdLockOutline } from 'react-icons/md';

const NotAuthorized = () => {
  return (
    <Center w='100%' flexDir='column' minH='70vh' px={4}>
      <Flex
        flexDir='column'
        align='center'
        gap={4}
        p={8}
        borderRadius='lg'
        boxShadow='md'
      >
        <Icon as={MdLockOutline} w={12} h={12} color='red.500' />
        <Heading size='lg'>Acceso Denegado</Heading>
        <Text mt={4} fontSize='md' maxW='400px'>
          No tenés permiso para ver esta página. Si creés que esto es un error,
          comunicate con el administrador del sistema.
        </Text>
        <Button
          mt={6}
          as={Link}
          size='sm'
          bg='blue.400'
          color='white'
          href='/'
          _hover={{ bg: 'blue.500' }}
        >
          Volver al inicio
        </Button>
      </Flex>
    </Center>
  );
};

export default NotAuthorized;
