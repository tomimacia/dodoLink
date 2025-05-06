import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { MdErrorOutline } from 'react-icons/md';
import Link from 'next/link';

const NotFoundPage = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <Center minH='70vh'>
      <Flex
        direction='column'
        align='center'
        gap={4}
        p={8}
        boxShadow='md'
        borderRadius='2xl'
        bg='gray.50'
        maxW='400px'
      >
        <Icon as={MdErrorOutline} boxSize={12} color='red.400' />
        <Heading textAlign='center' as='h2' size='lg' color='gray.700'>
          {title}
        </Heading>
        <Text maxW='350px' fontSize='sm' color='gray.500'>
          {content}
        </Text>
        <Divider borderColor='gray.300' w='80%' />
        <Button
          as={Link}
          href='/'
          size='sm'
          colorScheme='gray'
          variant='outline'
          _hover={{ bg: 'gray.100' }}
        >
          Volver al inicio
        </Button>
      </Flex>
    </Center>
  );
};

export default NotFoundPage;
