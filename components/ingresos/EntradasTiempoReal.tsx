import { useOnCurso } from '@/context/useOnCursoContext';
import { Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import ReactLoading from 'react-loading';
import EntradasSection from './EntradasSection';
import NoPedidosCard from './NoPedidosCard';
const EntradasTiempoReal = () => {
  const { data, loading } = useOnCurso();
  const loadingColor = useColorModeValue('#333c87', '#7EC1D8');
  const { reservas, compras } = data ?? {};
  const showPedidosCard =
    !loading &&
    (!reservas || reservas?.length === 0) &&
    (!compras || compras?.length === 0);

  return (
    <Flex m={2} gap={5} flexDir='column'>
      <Heading as='h2' size='xl' textAlign='center'>
        Pedidos en Curso
      </Heading>
      <Flex w='100%' flexDir='column'>
        {loading && (
          <Flex maxW='700px' my={10} justify='center'>
            <ReactLoading
              type='bars'
              color={loadingColor}
              height='100px'
              width='50px'
            />
          </Flex>
        )}
        {showPedidosCard && <NoPedidosCard />}
        <EntradasSection
          title='Reservas'
          loading={loading}
          grupo={reservas || []}
        />
        <EntradasSection
          title='Compras'
          loading={loading}
          grupo={compras || []}
        />
      </Flex>
    </Flex>
  );
};
export default EntradasTiempoReal;
