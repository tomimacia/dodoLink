import { useUser } from '@/context/userContext';
import dateTexto from '@/helpers/dateTexto';
import { Flex, Text } from '@chakra-ui/react';
import CargarModal from '../movimientos/CargarModal';
import ClockComp from './Clock';

const WelcomeComp = () => {
  const { user } = useUser();

  return (
    <Flex
      flexDir={[
        'column',
        'column',
        'row-reverse',
        'row-reverse',
        'row-reverse',
      ]}
      w='100%'
      justify='space-between'
    >
      <Flex justify='flex-end' gap={2}>
        <Text>{dateTexto(new Date().getTime() / 1000).textoDate}</Text>
        <span>-</span>
        <ClockComp />
      </Flex>
      <Flex flexDir='column' gap={3} justify='space-between'>
        <Flex flexDir='column'>
          <Text>{user?.rol}</Text>
          <Text fontSize='xl'>
            Bienvenido <strong>{user?.nombre}</strong>
          </Text>
        </Flex>
        <Flex gap={3} justify='space-around'>
          <CargarModal size='sm' />
          <CargarModal size='sm' initialIsPago />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default WelcomeComp;
