import { FormProvider } from '@/context/useCobrarFormContext';
import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import useSaldoData from '@/hooks/users/useSaldoData';
import { useEnter } from '@/hooks/eventHooks/useEnter';
import { ClientType } from '@/types/types';
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
import IngresoBody from '../ingresos/PedidoBody';
import CargarModal from '../movimientos/CargarModal';
import ClienteModal from './Editar/ClienteModal';
import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import ReactivarModal from './Editar/ReactivarModal';

const ConsultarCliente = () => {
  const { user } = useUser();
  const [consulta, setConsulta] = useState('');
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [registryUser, setRegistryUser] = useState<ClientType | null>(null);
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
        description: 'Ingresa un DNI válido',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setLoadingForm(true);
    try {
      const cliente = (await getSingleDoc('clientes', consulta)) as ClientType;

      if (!cliente) {
        toast({
          title: 'No encontrado',
          description: `DNI ${consulta} no registrado`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      } else {
        setRegistryUser(cliente);
      }
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
  const { color, estado, saldoColor } = useSaldoData(registryUser);
  const onKeyDown = useEnter(valueRef, onSubmit);
  const borrarColor = useColorModeValue(
    { bg: 'darkGray', color: 'white' },
    { bg: 'gray.200', color: 'black' }
  );
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={loadingForm ? 'Loading' : registryUser ? 'ShowUser' : 'ShowInput'}
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
          (registryUser ? (
            <Flex flexDir='column'>
              <Button
                w='fit-content'
                alignSelf='flex-end'
                bg={borrarColor.bg}
                color={borrarColor.color}
                size='xs'
                onClick={() => setRegistryUser(null)}
                _hover={{ opacity: 0.65 }}
              >
                Borrar Consulta
              </Button>
              <IngresoBody
                client={registryUser}
                color={color}
                saldoColor={saldoColor}
                estado={estado}
                animated
                ingresoSeconds={new Date().getTime() / 1000}
                size='consulta'
              />
              <Flex gap={5}>
                {estado === 'Inactivo' ? (
                  <Flex my={2}>
                    <ReactivarModal
                      setNewCliente={setRegistryUser}
                      size='sm'
                      cliente={registryUser}
                    />
                  </Flex>
                ) : (
                  <FormProvider>
                    <CargarModal size='sm' client={registryUser} />
                  </FormProvider>
                )}
                {user?.rol === 'Superadmin' && (
                  <Flex my={2}>
                    <ClienteModal
                      setNewCliente={setRegistryUser}
                      size='sm'
                      cliente={registryUser}
                    />
                  </Flex>
                )}
              </Flex>
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
                onWheel={(e: any) => e.target.blur()}
                onKeyDown={onKeyDown}
                size='sm'
                type='number'
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                placeholder='Ingresar DNI'
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

export default ConsultarCliente;
