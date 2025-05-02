import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import ProductoCard from './ProductoCard';
import useScanDetection from '@/hooks/useScanDetection';

const ConsultarProducto = () => {
  const [consulta, setConsulta] = useState('');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [registryProducto, setRegistryProducto] = useState<ProductoType | null>(
    null
  );
  const toast = useToast();
  const valueRef = useRef<HTMLInputElement | null>(null);

  const variants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };
  const buscarProducto = async (codigo: String) => {
    setLoadingForm(true);
    try {
      const productos = (await getMultipleDocs(
        'productos',
        'codigo',
        'array-contains',
        Number(codigo)
      )) as ProductoType[];

      if (productos.length === 0) {
        toast({
          title: 'No encontrado',
          description: `Código ${codigo} no registrado`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      } else {
        setRegistryProducto(productos[0]);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error inesperado',
        description: 'Hubo un error buscando el producto',
        status: 'error',
        duration: 9000,
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
    onComplete: (code) => {
      if (!registryProducto) return;
      if (registryProducto.codigo + '' === code) return;
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
      <motion.div
        key={
          loadingForm ? 'Loading' : registryProducto ? 'ShowUser' : 'ShowInput'
        }
        initial='initial'
        animate='enter'
        exit='exit'
        variants={variants}
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
        }}
        layout
      >
        {!loadingForm &&
          (registryProducto ? (
            <Flex gap={4} flexDir='column'>
              <Button
                w='fit-content'
                alignSelf='flex-end'
                bg={borrarColor.bg}
                color={borrarColor.color}
                size='xs'
                onClick={() => setRegistryProducto(null)}
                _hover={{ opacity: 0.65 }}
              >
                Borrar Consulta
              </Button>
              <ProductoCard
                setNewProducto={setRegistryProducto}
                producto={registryProducto}
              />
            </Flex>
          ) : (
            <Flex p={2} gap={2} flexDir='column'>
              <Text fontWeight='bold' fontSize='lg'>
                Consultar por Código
              </Text>
              <Input
                borderColor='gray'
                name='consulta_DNI'
                borderRadius='5px'
                maxW='250px'
                ref={valueRef}
                onKeyDown={onKeyDown}
                onWheel={(e: any) => e.target.blur()}
                size='sm'
                type='number'
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                placeholder='Ingresar código'
                autoFocus
              />
              <Button
                type='submit'
                isLoading={loadingForm}
                size='sm'
                w='fit-content'
                bg='blue.400'
                onClick={onSubmit}
                _hover={{ opacity: 0.65 }}
              >
                Ingresar
              </Button>
            </Flex>
          ))}
        {loadingForm && (
          <Flex p={4} justify='center' mx='auto'>
            <ReactLoading
              type='bars'
              color='#333c87'
              height='70px'
              width='70px'
            />
          </Flex>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsultarProducto;
