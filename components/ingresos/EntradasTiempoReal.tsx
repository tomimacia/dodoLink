import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Divider, Flex, Heading } from '@chakra-ui/react';
import ReactLoading from 'react-loading';
import EntradasSection from './EntradasSection';
import QrScanner from '../inicio/QrScanner';
const EntradasTiempoReal = () => {
  const { data, loading } = useOnCurso();
  const { user } = useUser();
  const { loadingColor } = useThemeColors();
  const { reservas, compras } = data ?? {};
  return (
    <Flex m={2} gap={5} flexDir='column'>
      <Heading as='h2' size='xl' textAlign='center'>
        Pedidos en Curso
      </Heading>
      <QrScanner title={`Escanear Código de Pedido`} />
      <Flex gap={6} w='100%' flexDir='column'>
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
        <EntradasSection title='Reservas' grupo={reservas || []} />
        {CheckAdminRol(user?.rol) && <Divider borderColor='gray' />}
        {CheckAdminRol(user?.rol) && (
          <EntradasSection title='Compras' grupo={compras || []} />
        )}
      </Flex>
    </Flex>
  );
};
export default EntradasTiempoReal;
