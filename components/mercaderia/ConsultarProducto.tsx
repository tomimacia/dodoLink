import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import useScanDetection from '@/hooks/useScanDetection';
import { ProductoType } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import ProductoCard from './ProductoCard';

const MotionBox = motion(Box);

const ConsultarProducto = () => {
  const [consulta, setConsulta] = useState('');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [registryProductos, setRegistryProductos] = useState<ProductoType[]>(
    []
  );
  const toast = useToast();
  const valueRef = useRef<HTMLInputElement | null>(null);

  const buscarProducto = async (input: string) => {
    setLoadingForm(true);
    try {
      const isNumeric = !isNaN(Number(input));
      const productos = (await getMultipleDocs(
        'productos',
        isNumeric ? 'codigo' : 'queryArr',
        'array-contains',
        isNumeric ? Number(input) : input.toLowerCase()
      )) as ProductoType[];

      if (productos.length === 0) {
        toast({
          title: 'No encontrado',
          description: `No se encontraron productos con "${input}"`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setRegistryProductos(productos);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error inesperado',
        description: 'Hubo un error buscando el producto',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingForm(false);
      setConsulta('');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consulta) return;
    await buscarProducto(consulta);
  };

  useScanDetection({
    onComplete: (code: any) => {
      if (registryProductos.length === 0) return;
      // if (registryProducto.codigo + '' === code) return;
      buscarProducto(code);
    },
    minLength: 5,
  });

  const onKeyDown = useEnter(valueRef, onSubmit);

  const borrarColor = useColorModeValue(
    { bg: 'gray.700', color: 'white' },
    { bg: 'gray.200', color: 'black' }
  );

  return (
    <AnimatePresence mode='wait'>
      <MotionBox
        key={
          loadingForm
            ? 'Loading'
            : registryProductos.length
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
        ) : registryProductos.length ? (
          <Flex direction='column' gap={4}>
            <Flex justify='space-between' align='center' mb={2}>
              <Text fontSize='md'>
                Resultados: <b>{registryProductos.length}</b>
              </Text>
              <Button
                size='sm'
                bg={borrarColor.bg}
                color={borrarColor.color}
                onClick={() => setRegistryProductos([])}
                _hover={{ opacity: 0.8 }}
              >
                Borrar consulta
              </Button>
            </Flex>
            {registryProductos.map((regProd) => (
              <ProductoCard
                key={regProd.id}
                producto={regProd}
                delay={0}
                setNewProductos={setRegistryProductos}
              />
            ))}
          </Flex>
        ) : (
          <form onSubmit={onSubmit}>
            <Flex direction='column' gap={4}>
              <Box>
                <Heading size='md' mb={1}>
                  Consultar Producto
                </Heading>
                <Text fontSize='sm'>Buscar por nombre o código</Text>
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

export default ConsultarProducto;
