import {
  MovimientosProvider,
  useMovimientos,
} from '@/context/useMovimientosContext';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import ReactLoading from 'react-loading';

const MovimientosLayout = ({
  title,
  isCaja,
  children,
}: {
  title: string;
  children: ReactNode;
  isCaja?: boolean;
}) => {
  const { loadingMovimientos, getMovimientos } = useMovimientos();
  const showStatus = isCaja;
  const isLoading = loadingMovimientos;
  const customGray = useColorModeValue('gray.600', 'gray.800');
  return (
    <Flex flexDir='column' gap={5}>
      <Divider borderColor='gray' mt={3} />
      <Flex align='center' justify='space-between' px={[1, 2, 3, 4, 5]}>
        <Heading as='h2'>{title}</Heading>

        <Button
          bg={customGray}
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={getMovimientos}
          isLoading={loadingMovimientos}
        >
          Actualizar
        </Button>
      </Flex>
      {isLoading ? (
        <Flex
          left={0}
          w='100%'
          pos='absolute'
          h='400px'
          align='center'
          justify='center'
        >
          <ReactLoading type='spinningBubbles' color='#495568' />
        </Flex>
      ) : showStatus ? (
        <Flex p={[0, 1, 2, 3, 4]} flexDir='column' h='100%'>
          {children}
        </Flex>
      ) : (
        <Flex gap={5} mx='auto' flexDir='column'>
          <Heading fontSize='xl' textAlign='center'>
            Caja Cerrada
          </Heading>
          <Text>Ingresá mas tarde o contactá a un administrador</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default MovimientosLayout;
MovimientosLayout.provider = MovimientosProvider;
