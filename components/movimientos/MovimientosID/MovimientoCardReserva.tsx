import CopyButton from '@/components/CopyButton';
import DeleteModal from '@/components/DeleteModal';
import EstadoStepsReserva from '@/components/movimientos/MovimientosID/EstadoStepsReserva';
import NotAuthorized from '@/components/Navigation/NotAuthorized';
import { CheckAdminRol } from '@/data/data';
import dateTexto from '@/helpers/dateTexto';
import { scrollIntoTheView } from '@/helpers/scrollIntoTheView';
import usePedidosForm from '@/hooks/usePedidosForm';
import { PedidoType, ProductoType } from '@/types/types';
import {
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdLocationPin } from 'react-icons/md';
import MapEmbed from '../EmbedMap';
import ConfirmarReservaModal from './ConfimarPedidoModal/ConfirmarReservaModal';
import QRCodeLabel from './QRCodeLabel';
import VerMovimientosModal from './VerMovimientosModal';
import { Fragment } from 'react';

const MovimientoCardReserva = ({ movimiento }: { movimiento: PedidoType }) => {
  const {
    user,
    productos,
    estado,
    loadingUpdate,
    loadingDelete,
    currentMov,
    updatePedido,
    deleteFunc,
  } = usePedidosForm(movimiento);
  const { detalle, items, cliente, id, isPago, mapCoords, movimientos, tramo } =
    currentMov;
  const customGrayBG = useColorModeValue('gray.50', 'gray.700');
  const customGray = useColorModeValue('gray.600', 'gray.200');
  // Check si el usuario tiene el pedido en curso para Cuadrilla
  const hasReserva = movimientos?.['En curso'].admin === user?.id;
  if (!CheckAdminRol(user?.rol) && estado !== 'Pendiente' && !hasReserva)
    return <NotAuthorized />;
  const showDelete =
    user?.rol === 'Superadmin' ||
    ['En curso', 'Finalizado'].every((e) => e !== estado);
  return (
    <Flex gap={5} flexDir='column'>
      <Stack spacing={1}>
        <Flex align='center' justify='space-between'>
          <Flex gap={3} align='center'>
            <Text fontSize='sm' color={customGray}>
              Reserva -{' '}
              <Text as='span' fontWeight='medium' fontFamily='mono'>
                {id}
              </Text>
            </Text>
            <CopyButton
              content={id}
              description='Código guardado en el portapapeles'
            />
          </Flex>
          <Tooltip label='Ver ubicación'>
            <IconButton
              icon={<MdLocationPin />}
              variant='ghost'
              aria-label='Ver ubicación'
              onClick={() => scrollIntoTheView('embed-location')}
            />
          </Tooltip>
        </Flex>

        <Heading size='lg'>
          <strong>{cliente}</strong>
        </Heading>

        <Text fontSize='sm'>
          <b>Fecha:</b>{' '}
          {dateTexto(movimientos?.Inicializado?.fecha.seconds, true).numDate} -{' '}
          {dateTexto(movimientos?.Inicializado?.fecha.seconds).hourDate} HS
        </Text>

        {tramo !== 0 && tramo && (
          <Text fontSize='sm'>
            <b>Tramo:</b> {tramo} Mts.
          </Text>
        )}
      </Stack>
      <Flex gap={1} flexDir='column'>
        <EstadoStepsReserva estado={estado} />
        <VerMovimientosModal
          isPago={isPago}
          currentEstado={estado}
          pedido={currentMov}
        />
      </Flex>
      <Flex flexDir='column' gap={2}>
        <Heading fontWeight='normal' as='h2' size='md'>
          Detalle
        </Heading>
        <Flex
          minH='30px'
          p={2}
          borderRadius={5}
          boxShadow='md'
          bg={customGrayBG}
          whiteSpace='pre-wrap'
        >
          {detalle ? (
            <Text
              cursor='default'
              title={detalle.join('\n')}
              py={1}
              fontSize='md'
            >
              {detalle.map((l) => {
                return (
                  <Fragment key={`${l}-detalle-${id}}`}>
                    <span>{l}</span>
                    <br />
                  </Fragment>
                );
              })}
            </Text>
          ) : (
            <Text fontSize='sm'>{'Sin descripción'}</Text>
          )}
        </Flex>
      </Flex>
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
          bg={customGrayBG}
          gap={2}
        >
          {items.map((p) => (
            <Flex
              key={p.id + '-listed-pedido-id-key'}
              fontSize='sm'
              justify='space-between'
              borderBottom='1px solid #BEBEBE'
              gap={1}
            >
              <Text>{p.nombre}</Text>
              <Text minW='40px' fontWeight='bold'>
                {p.unidades} {p.medida}
              </Text>
            </Flex>
          ))}
        </Flex>
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
          color='black'
        >
          <QRCodeLabel pedido={currentMov} />
        </Flex>

        <Flex h='100%' id='embed-location' w='100%'>
          <MapEmbed initialShow hideButtons src={mapCoords} />
        </Flex>
      </Flex>

      <Flex justifyContent='center' my={10} gap={4}>
        <ConfirmarReservaModal
          loading={loadingUpdate}
          update={(
            newPedido: PedidoType,
            newItems: ProductoType[],
            sobrantes: ProductoType[],
            onClose: () => void
          ) => updatePedido(id, newPedido, newItems, sobrantes, onClose)}
          pedido={currentMov}
        />
        {showDelete && CheckAdminRol(user?.rol) && (
          <DeleteModal
            textContent='Eliminar'
            title='Pedido'
            nombre={`${currentMov.id} (${estado})`}
            size='md'
            loadingForm={loadingDelete}
            DeleteProp={deleteFunc}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default MovimientoCardReserva;
