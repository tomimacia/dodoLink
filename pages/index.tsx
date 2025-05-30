import EntradasTiempoReal from '@/components/ingresos/EntradasTiempoReal';
import WelcomeComp from '@/components/inicio/WelcomeComp';
import { Divider, Flex } from '@chakra-ui/react';
export default function Home() {
  return (
    <Flex gap={5} flexDir='column' w='100%'>
      <WelcomeComp />
      <Divider borderColor='gray' w='98%' mx='auto' />
      <EntradasTiempoReal />
    </Flex>
  );
}
