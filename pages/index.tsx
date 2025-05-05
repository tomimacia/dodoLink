import EntradasTiempoReal from '@/components/ingresos/EntradasTiempoReal';
import WelcomeComp from '@/components/inicio/WelcomeComp';
import { FormProvider } from '@/context/useCobrarFormContext';
import { Divider, Flex } from '@chakra-ui/react';
export default function Home() {
  return (
    <Flex gap={5} flexDir='column' w='100%'>
      <FormProvider>
        <WelcomeComp />
        <Divider borderColor='gray' w='98%' mx='auto' />

        <EntradasTiempoReal />
      </FormProvider>
    </Flex>
  );
}
