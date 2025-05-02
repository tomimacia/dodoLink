import { FormProvider } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { addDots } from '@/helpers/addDots';
import dateTexto from '@/helpers/dateTexto';
import useSaldoData from '@/hooks/users/useSaldoData';
import { ClientType } from '@/types/types';
import {
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import ReactLoading from 'react-loading';
import ClienteModal from './Editar/ClienteModal';
import CargarModal from '../movimientos/CargarModal';

const ClienteIDBody = ({ client }: { client: ClientType }) => {
  const [clientUpdated, setClientUpdated] = useState(client);
  const [loading, setLoading] = useState(false);
  const {
    nombre,
    DNI,
    domicilio,
    email,
    // recibirEmail,
    saldo,
    ingresoVencido,
    createdAt,
    vencimiento,
    apellido,
  } = clientUpdated;
  const { user } = useUser();
  const { estado, color, saldoColor } = useSaldoData(clientUpdated);
  const getNewClient = async () => {
    setLoading(true);
    try {
      const updatedClient = (await getSingleDoc(
        'clientes',
        client.id
      )) as ClientType;
      if (updatedClient) setClientUpdated(updatedClient);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const estadoTextColor = useColorModeValue('white', 'black');
  return (
    <Flex gap={2} flexDir='column'>
      <Flex flexDir='column'>
        <Heading size='lg'>
          {nombre} {apellido}
        </Heading>
        <Text fontStyle='italic'>DNI: {DNI}</Text>
      </Flex>

      {loading ? (
        <Flex maxW='400px' justify='center'>
          <ReactLoading type='cylon' color='#333c87' />
        </Flex>
      ) : (
        <Flex flexDir='column' gap={2}>
          <Flex
            w='100%'
            maxW='800px'
            fontSize='lg'
            p={2}
            flexDir='column'
            gap={1}
          >
            <Flex
              flexDir={['column', 'column', 'row', 'row']}
              my={3}
              align={['none', 'none', 'center', 'center']}
              justify='space-between'
              gap={2}
            >
              <Flex
                w='fit-content'
                p={2}
                borderRadius={5}
                bg={color}
                flexDir='column'
              >
                <Text color={estadoTextColor} fontSize={17} fontWeight='medium'>
                  Estado: {estado}
                </Text>
              </Flex>
              <Flex flexDir='column'>
                <Text>Vencimiento</Text>
                <Text>
                  <b>{dateTexto(vencimiento.seconds).textoDate}</b>
                </Text>
              </Flex>
            </Flex>
            <Flex align='center' justify='space-between' gap={2}>
              <Text>Saldo:</Text>
              <Text color={saldoColor}>
                <b>
                  ${saldo < 0 ? '-' : ''}
                  {addDots(Math.abs(saldo))}
                </b>
              </Text>
            </Flex>
            <Divider borderColor='gray' />
            <Flex align='center' justify='space-between' gap={2}>
              <Text>Domicilio:</Text>
              <Text>
                <b>{domicilio}</b>
              </Text>
            </Flex>
            <Divider borderColor='gray' />
            <Flex align='center' justify='space-between' gap={2}>
              <Text>Email:</Text>
              <Text>
                <b>{email}</b>
              </Text>
            </Flex>
            {/* <Divider borderColor='gray' />
            <Flex justify='space-between' gap={2} align='center'>
              <Text>Recibir Emails:</Text>
              <Checkbox isChecked={recibirEmail} />
            </Flex> */}

            {estado !== 'Habilitado' && (
              <>
                <Divider borderColor='gray' />
                <Flex align='center' justify='space-between' gap={2}>
                  <Text>Impacto Venc:</Text>
                  <Text noOfLines={1}>
                    {ingresoVencido ? (
                      <b>{dateTexto(ingresoVencido?.seconds).numDate}</b>
                    ) : (
                      'No hay (actualiza al pago)'
                    )}
                  </Text>
                </Flex>
              </>
            )}

            <Divider borderColor='gray' />
            <Flex align='center' justify='space-between' gap={2}>
              <Text noOfLines={1}>Alta Cliente:</Text>
              <Text noOfLines={1}>
                <b>{dateTexto(createdAt.seconds).numDate}</b>
              </Text>
            </Flex>
          </Flex>
          <Flex gap={5}>
            <FormProvider>
              <CargarModal
                size='sm'
                client={{
                  ...clientUpdated,
                  vencimiento: {
                    seconds: clientUpdated?.vencimiento?.seconds,
                    nanoseconds: 0,
                  },
                }}
                getNewClient={getNewClient}
              />
            </FormProvider>
            {user?.rol === 'Superadmin' && (
              <Flex my={2}>
                <ClienteModal
                  setNewCliente={setClientUpdated}
                  size='sm'
                  cliente={clientUpdated}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default ClienteIDBody;
