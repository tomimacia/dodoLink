import { useUser } from '@/context/userContext';
import dateTexto from '@/helpers/dateTexto';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReactLoading from 'react-loading';
import ClienteModal from './Editar/ClienteModal';

const ClienteIDBody = ({ client }: { client: any }) => {
  const [clientUpdated, setClientUpdated] = useState(client);
  const [loading, setLoading] = useState(false);
  const {
    nombre,
    DNI,
    domicilio,
    email,
    createdAt,
    vencimiento,
    apellido,
  } = clientUpdated;
  const { user } = useUser();
  const { invertedTextColor } = useThemeColors();
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
                bg={'green'}
                flexDir='column'
              >
                <Text
                  color={invertedTextColor}
                  fontSize={17}
                  fontWeight='medium'
                >
                  Estado: {'estado'}
                </Text>
              </Flex>
              <Flex flexDir='column'>
                <Text>Vencimiento</Text>
                <Text>
                  <b>{dateTexto(vencimiento.seconds).textoDate}</b>
                </Text>
              </Flex>
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
            <Divider borderColor='gray' />
            <Flex align='center' justify='space-between' gap={2}>
              <Text noOfLines={1}>Alta Cliente:</Text>
              <Text noOfLines={1}>
                <b>{dateTexto(createdAt.seconds).numDate}</b>
              </Text>
            </Flex>
          </Flex>
          <Flex gap={5}>
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
