import { Button, Center, Divider, Flex, Heading } from '@chakra-ui/react';
import Link from 'next/link';

const NotFoundPage = ({ title }: { title: string }) => {
  return (
    <Center mx='auto'>
      <Flex
        gap={4}
        boxShadow='0 0 5px 1px gray'
        borderRadius={10}
        flexDir='column'
        p={4}
        align='center'
        mt={10}
      >
        <Heading as='h2' size='lg'>
          {title}
        </Heading>
        <Divider borderColor='gray' w='95%' />
        <Button
          _hover={{ opacity: 0.65 }}
          as={Link}
          w='fit-content'
          size='sm'
          bg='gray.300'
          href='/'
        >
          Volver
        </Button>
      </Flex>
    </Center>
  );
};

export default NotFoundPage;
