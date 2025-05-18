import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { MovimientosType, PedidoType } from '@/types/types';
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
import PedidoConsultaCard from './PedidoConsultaCard';

const ConsultarPedido = ({ isCompra }: { isCompra: boolean }) => {
  const [consulta, setConsulta] = useState('');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [registryPedido, setRegistryPedido] = useState<any | null>(null);
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
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consulta) return;
    if (consulta.length < 7) {
      toast({
        title: 'Error',
        description: 'Ingresa un ID válido',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setLoadingForm(true);
    try {
      const docID = formatearFecha(consulta);
      const movimientos = (await getSingleDoc(
        'movimientos',
        docID
      )) as MovimientosType;
      if (!movimientos) {
        return {
          props: {
            movimiento: null,
          },
        };
      }
      const pedidos = isCompra ? movimientos.compras : movimientos.reservas;
      const selectedMov = pedidos.find((i) => i?.id === consulta) as
        | PedidoType
        | undefined;
      if (!selectedMov) {
        return;
      }
      setRegistryPedido(selectedMov);
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error inesperado',
        description: 'Hubo un error buscando el cliente',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoadingForm(false);
      setConsulta('');
    }
  };
  const onKeyDown = useEnter(valueRef, onSubmit);
  const borrarColor = useColorModeValue(
    { bg: 'darkGray', color: 'white' },
    { bg: 'gray.200', color: 'black' }
  );

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={
          loadingForm ? 'Loading' : registryPedido ? 'ShowUser' : 'ShowInput'
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
          (registryPedido ? (
            <Flex gap={4} flexDir='column'>
              <Button
                w='fit-content'
                alignSelf='flex-end'
                bg={borrarColor.bg}
                color={borrarColor.color}
                size='xs'
                onClick={() => setRegistryPedido(null)}
                _hover={{ opacity: 0.65 }}
              >
                Borrar Consulta
              </Button>
              <PedidoConsultaCard pedido={registryPedido} isCompra={isCompra} />
            </Flex>
          ) : (
            <Flex p={2} gap={2} flexDir='column'>
              <Text fontWeight='bold' fontSize='lg'>
                Consultar por ID
              </Text>
              <Input
                borderColor='gray'
                name='consulta_DNI'
                borderRadius='5px'
                maxW='250px'
                ref={valueRef}
                onWheel={(e: any) => e.target.blur()}
                onKeyDown={onKeyDown}
                size='sm'
                type='text' // debe mantenerse como text para permitir "-"
                value={consulta}
                onChange={(e) => {
                  const value = e.target.value;
                  // Solo permite números y guiones
                  if (/^[0-9-]*$/.test(value)) {
                    setConsulta(value);
                  }
                }}
                placeholder='Ingresar ID único'
                autoFocus
                autoComplete='off'
                formNoValidate
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

export default ConsultarPedido;
