import CopyButton from '@/components/CopyButton';
import EstadoSteps from '@/components/ingresos/EstadoSteps';
import { useOnCurso } from '@/context/useOnCursoContext';
import dateTexto from '@/helpers/dateTexto';
import useGetUsers from '@/hooks/users/useGetUsers';
import { PedidoType } from '@/types/types';
import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MapEmbed from '../EmbedMap';
import QRCodeLabel from './QRCodeLabel';
import { MdLocationPin } from 'react-icons/md';
const MovimientoCard = ({ movimiento }: { movimiento: PedidoType }) => {
  const { reservas } = useOnCurso();
  const [currentMov, setCurrentMov] = useState(movimiento);
  useEffect(() => {
    const newMov = reservas?.find((r) => r.id === movimiento.id) || {
      ...movimiento,
      estado: 'Finalizado',
    };
    setCurrentMov(newMov);
  }, [reservas]);

  const {
    detalle,
    items,
    cliente,
    id,
    estado,
    isPago,
    mapCoords,
    creadorID,
    fecha,
  } = currentMov;
  const { users } = useGetUsers();
  const creador = users?.find((user) => user.id === creadorID);
  const scrollToMap = () => {
    const el = document.getElementById('embed-location');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <Flex gap={5} flexDir='column'>
      <Flex flexDir='column'>
        <Flex align='center' justify='space-between'>
          <Flex gap={3} align='center'>
            <Text fontSize='sm'>
              {!isPago ? 'Reserva' : 'Compra'} - <i>{id}</i>
            </Text>
            <CopyButton
              content={id}
              description='Código guardado en el portapapeles'
            />
          </Flex>
          <MdLocationPin onClick={scrollToMap} cursor='pointer' />
        </Flex>
        <Heading fontWeight='normal' size='lg'>
          <strong> {cliente}</strong>
        </Heading>
        <Text fontStyle='italic'>
          Inicializado: <b>{dateTexto(fecha?.seconds, true).numDate}</b> -{' '}
          {dateTexto(fecha?.seconds).hourDate} HS
        </Text>
      </Flex>
      <EstadoSteps estado={estado} />

      <Flex flexDir='column' gap={2}>
        <Heading fontWeight='normal' as='h2' size='md'>
          Detalle
        </Heading>
        <Flex
          minH='30px'
          p={2}
          borderRadius={5}
          boxShadow='md'
          bg='gray.50'
          whiteSpace='pre-wrap'
        >
          <Text fontSize='sm'>{detalle || 'Sin descripción'}</Text>
        </Flex>
      </Flex>
      <Divider borderColor='gray' />
      {/* Lista de productos */}
      <Flex flexDir='column' gap={2}>
        <Heading fontWeight='normal' as='h2' size='md'>
          Productos
        </Heading>
        <Flex
          flexDir='column'
          p={3}
          borderRadius={5}
          boxShadow='md'
          bg='gray.50'
          gap={2}
        >
          {items.map((p) => (
            <Flex
              key={p.id + '-listed-pedido-id-key'}
              fontSize='md'
              justify='space-between'
              borderBottom='1px solid #e2e8f0'
              pb={1}
            >
              <Text>{p.nombre}</Text>
              <Text fontWeight='bold'>
                {p.unidades} {p.medida}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Información del creador */}
      <Flex w='100%' maxW='700px' fontSize='md' p={2} flexDir='column' gap={1}>
        <Text>
          Admin:{' '}
          <b>
            {creador?.nombre} {creador?.apellido}
          </b>
        </Text>
      </Flex>

      {/* Código QR + Mapa */}
      <Flex
        gap={4}
        mt={4}
        flexDir={{ base: 'column-reverse', md: 'row' }}
        alignItems='flex-start'
      >
        <Flex
          p={4}
          border='1px solid #e2e8f0'
          borderRadius='md'
          alignItems='center'
          justifyContent='center'
          bg='white'
        >
          <QRCodeLabel pedido={currentMov} />
        </Flex>
        <Flex id='embed-location' w='100%'>
          <MapEmbed hideButton src={mapCoords} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MovimientoCard;
