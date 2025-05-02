import { Button, Center, Flex, Heading } from '@chakra-ui/react';
import Link from 'next/link';

const NotAuthorized = () => {
  return (
    <Center flexDir='column' mx='auto'>
      <Flex
        w='100%'
        flexDir='column'
        mt={8}
        align='center'
        justify='space-between'
      >
        <Heading textAlign='center' size='lg'>
          No Autorizado
        </Heading>
      </Flex>
      <Button
        mt={10}
        as={Link}
        w='fit-content'
        size='sm'
        bg='blue.300'
        href='/'
        _hover={{ opacity: 0.65 }}
      >
        Volver
      </Button>
    </Center>
  );
};

export default NotAuthorized;
