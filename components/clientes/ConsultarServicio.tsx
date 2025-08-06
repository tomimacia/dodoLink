import useGetServicios from '@/hooks/data/useGetServicios';
import useGetServiciosSQL from '@/hooks/data/useGetServiciosSQL';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { HighlightedText } from '../HighlightedText';

const MotionBox = motion(Box);

const ConsultarServicio = () => {
  const { serviciosSQL } = useGetServiciosSQL();
  const { servicios } = useGetServicios(true);
  const [consulta, setConsulta] = useState('');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [registryServicios, setRegistryServicios] = useState<any[]>([]);
  const toast = useToast();
  const valueRef = useRef<HTMLInputElement | null>(null);

  const buscarServicio = async (input: string) => {
    if (consulta.length < 3) {
      toast({
        title: 'Error',
        description: 'La consulta debe ser por lo menos de 3 carácteres',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoadingForm(true);
    try {
      const mappedServicios = servicios?.map((sDB) => {
        const servicioFound =
          serviciosSQL?.find((s) => s.id + '' === sDB.id) || {};
        return { ...servicioFound, ...sDB };
      });
      const serviciosFound = mappedServicios?.filter((s) =>
        [s?.description, s?.name]
          ?.join(' ')
          .toLowerCase()
          .includes(input.toLowerCase())
      );
      if (!serviciosFound || serviciosFound.length === 0) {
        toast({
          title: 'No encontrado',
          description: `No se encontraron servicios con "${input}"`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        setConsulta('');
      } else {
        setRegistryServicios(serviciosFound);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error inesperado',
        description: 'Hubo un error buscando el servicio',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingForm(false);
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consulta) return;
    await buscarServicio(consulta);
  };

  const onKeyDown = useEnter(valueRef, onSubmit);
  const borrarColor = useColorModeValue(
    { bg: 'gray.700', color: 'white' },
    { bg: 'gray.200', color: 'black' }
  );
  const customBG = useColorModeValue('white', 'gray.800');
  const customGray = useColorModeValue('gray.700', 'gray.300');
  const router = useRouter();
  return (
    <AnimatePresence mode='wait'>
      <MotionBox
        key={
          loadingForm
            ? 'Loading'
            : registryServicios.length
            ? 'Results'
            : 'Form'
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        w='100%'
        mx='auto'
        mt={6}
        px={4}
      >
        {loadingForm ? (
          <Flex p={4} justify='center'>
            <ReactLoading
              type='bars'
              color='#3182ce'
              height='70px'
              width='70px'
            />
          </Flex>
        ) : registryServicios.length ? (
          <Flex direction='column' gap={4}>
            <Flex justify='space-between' align='center' mb={2}>
              <Text fontSize='md'>
                Resultados para &quot;{consulta}&quot;:{' '}
                <b>{registryServicios.length}</b>
              </Text>
              <Button
                size='sm'
                bg={borrarColor.bg}
                color={borrarColor.color}
                onClick={() => {
                  setRegistryServicios([]);
                  setConsulta('');
                }}
                _hover={{ opacity: 0.8 }}
              >
                Borrar consulta
              </Button>
            </Flex>
            {registryServicios.map((regProd, idx) => (
              <Box
                id={`products-listed-key-${regProd.id}-${idx}`}
                cursor='pointer'
                onClick={() => router.push(`/ServicioID/${regProd.id}`)}
                key={regProd.id + 'regprod-id-list' + regProd?.name}
                borderLeft='4px solid'
                borderColor='teal.400'
                borderRadius='xl'
                p={5}
                shadow='md'
                bg={customBG}
                borderWidth='1px'
                _hover={{ shadow: 'lg' }}
                transition='all 0.2s'
              >
                <Stack spacing={3}>
                  <Text fontSize='xl' fontWeight='bold' color='teal.600'>
                    <HighlightedText
                      query={consulta}
                      text={regProd?.name || 'Sin nombre'}
                    />
                  </Text>

                  <Text fontSize='sm' color='gray.500'>
                    ID: {regProd?.id}
                  </Text>

                  <Flex flexDir='column'>
                    {regProd?.description &&
                    typeof regProd?.description === 'string' ? (
                      <Text fontSize='sm' noOfLines={3} color={customGray}>
                        <HighlightedText
                          query={consulta}
                          text={regProd?.description}
                        />
                      </Text>
                    ) : (
                      regProd?.description?.map((l: string) => (
                        <Text
                          key={`reg-description-key-${l}-${regProd.id}`}
                          fontSize='sm'
                          noOfLines={3}
                          color={customGray}
                        >
                          <HighlightedText query={consulta} text={l} />
                        </Text>
                      ))
                    )}
                  </Flex>

                  <Box pt={2}>
                    <Text fontSize='xs' fontWeight='medium' color='gray.400'>
                      Actualizado:
                    </Text>
                    <Text fontSize='xs' color='gray.500'>
                      {new Date(regProd?.updated_at).toLocaleDateString()}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Flex>
        ) : (
          <form onSubmit={onSubmit}>
            <Flex direction='column' gap={4}>
              <Box>
                <Heading size='md' mb={1}>
                  Consultar Servicio
                </Heading>
                <Text fontSize='sm'>Buscar por nombre o descripción</Text>
              </Box>
              <Input
                ref={valueRef}
                size='sm'
                maxW='300px'
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                onKeyDown={onKeyDown}
                onWheel={(e: any) => e.target.blur()}
                placeholder='Ej: switch o 123456'
                borderRadius='md'
                borderColor='gray.400'
              />
              <Button
                type='submit'
                isLoading={loadingForm}
                size='sm'
                w='fit-content'
                bg='blue.500'
                color='white'
                _hover={{ bg: 'blue.600' }}
              >
                Buscar
              </Button>
            </Flex>
          </form>
        )}
      </MotionBox>
    </AnimatePresence>
  );
};

export default ConsultarServicio;
