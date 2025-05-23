import EntradasTiempoReal from '@/components/ingresos/EntradasTiempoReal';
import WelcomeCompContext from '@/components/inicio/WelcomeComponentes/WelcomeCompContext';
import { Divider, Flex } from '@chakra-ui/react';
export default function Home() {
  return (
    <Flex gap={5} flexDir='column' w='100%'>
      <WelcomeCompContext />
      <Divider borderColor='gray' w='98%' mx='auto' />
      <EntradasTiempoReal />
    </Flex>
  );
}
