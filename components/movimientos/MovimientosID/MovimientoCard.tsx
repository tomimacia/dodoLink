import EstadoSteps from '@/components/ingresos/EstadoSteps';
import { useOnCurso } from '@/context/useOnCursoContext';
import dateTexto from '@/helpers/dateTexto';
import useGetUsers from '@/hooks/users/useGetUsers';
import { PedidoType } from '@/types/types';
import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import MapEmbed from '../EmbedMap';
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

  const { detalle, cliente, id, estado, isPago, mapCoords, creadorID, fecha } =
    currentMov;
  const { users } = useGetUsers();
  const creador = users?.find((user) => user.id === creadorID);
  return (
    <Flex gap={5} flexDir='column'>
      <Flex flexDir='column'>
        <Text fontSize='sm'>
          {!isPago ? 'Reserva' : 'Compra'} - <i>{id}</i>
        </Text>
        <Heading fontWeight='normal' size='lg'>
          <strong> {cliente}</strong>
        </Heading>
        <Text fontStyle='italic'>
          Inicializado:{' '}
          <b>
            {dateTexto(fecha?.seconds).numDate} -{' '}
            {dateTexto(fecha?.seconds).hourDate}
          </b>
        </Text>
      </Flex>
      <EstadoSteps estado={estado} />

      <Divider borderColor='gray' />
      <Flex flexDir='column' gap={2}>
        <Heading fontWeight='normal' as='h2' size='md'>
          Detalle
        </Heading>
        <Flex minH='60px' p={2} borderRadius={5} boxShadow='0 0px 3px'>
          <Text fontSize='sm'>{detalle}</Text>
        </Flex>
      </Flex>
      <Flex w='100%' maxW='700px' fontSize='md' p={2} flexDir='column' gap={1}>
        <Text>
          Admin:{' '}
          <b>
            {creador?.nombre} {creador?.apellido}
          </b>
        </Text>
      </Flex>
      <QRCode value={id} />
      <MapEmbed src={mapCoords} />

      {/* {user?.rol === 'Superadmin' && (
        <ProductoModal
          setNewProducto={setNewProducto}
          updateProducto={updateProducto}
          size='sm'
          producto={producto}
        />
      )} */}
    </Flex>
  );
};

export default MovimientoCard;
