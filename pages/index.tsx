import EntradasTiempoReal from '@/components/ingresos/EntradasTiempoReal';
import WelcomeComp from '@/components/inicio/WelcomeComp';
import { useUser } from '@/context/userContext';
import { Button, Divider, Flex } from '@chakra-ui/react';
import Link from 'next/link';
export default function Home() {
  const { user } = useUser();
  return (
    <Flex gap={5} flexDir='column' w='100%'>
      <WelcomeComp />
      <Divider borderColor='gray' w='98%' mx='auto' />
      {user?.rol !== 'NOC Support' && <EntradasTiempoReal />}
      {user?.rol === 'NOC Support' && (
        <Flex gap={2} w='fit-content' flexDir='column'>
          <Button
            as={Link}
            href='/Clientes'
            colorScheme='blue'
            variant='outline'
          >
            Ver Clientes
          </Button>
          <Button
            as={Link}
            href='/Clientes/Servicios'
            colorScheme='blue'
            variant='outline'
          >
            Ver Servicios
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
