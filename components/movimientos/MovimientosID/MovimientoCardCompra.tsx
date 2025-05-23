import CopyButton from '@/components/CopyButton';
import DeleteModal from '@/components/DeleteModal';
import NotAuthorized from '@/components/Navigation/NotAuthorized';
import { CheckAdminRol } from '@/data/data';
import dateTexto from '@/helpers/dateTexto';
import { scrollIntoTheView } from '@/helpers/scrollIntoTheView';
import usePedidosForm from '@/hooks/usePedidosForm';
import { PedidoType } from '@/types/types';
import {
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { MdCheckCircle, MdLocationPin } from 'react-icons/md';
import { TiWarning } from 'react-icons/ti';
import ConfirmarCompraModal from './ConfirmarCompraModal/ConfirmarCompraModal';
import EstadoStepsCompra from './EstadoStepsCompra';
import VerMovimientosModal from './VerMovimientosModal';
import NotFoundPage from '@/components/NotFoundPage';

const MovimientoCardCompra = ({ movimiento }: { movimiento: PedidoType }) => {
  const {
    user,
    estado,
    loadingUpdate,
    loadingDelete,
    currentMov,
    showDeleted,
    updateCompra,
    deleteFuncCompra,
    disclosure,
  } = usePedidosForm(movimiento);
  const { detalle, items, cliente, id, isPago, movimientos, tramo } =
    currentMov;
  const customGrayBG = useColorModeValue('gray.50', 'gray.700');
  const checkColor = useColorModeValue('#54B441', '#9AE6B4');
  const pendienteColor = useColorModeValue('#DD6B20', '#FBD38D');

  // Check si el usuario tiene el pedido en curso para Cuadrilla
  if (showDeleted) {
    return (
      <NotFoundPage
        content='El movimiento que buscás no existe o fue eliminado.'
        title='Movimiento no encontrado'
      />
    );
  }
  if (!CheckAdminRol(user?.rol)) return <NotAuthorized />;
  const showDelete =
    user?.rol === 'Superadmin' ||
    ['En curso', 'Finalizado'].every((e) => e !== estado);
  const itemsPendientes = items.filter(
    (i) => !currentMov?.confirmedItems?.some((ci) => ci.id === i.id)
  );
  const itemsRecibidos = currentMov?.confirmedItems;
  return (
    <Flex gap={5} flexDir='column'>
      <Stack spacing={1}>
        <Flex align='center' justify='space-between'>
          <Flex gap={3} align='center'>
            <Text fontSize='sm' color='gray.600'>
              Compra -{' '}
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
        <EstadoStepsCompra estado={estado} />
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
          <Text fontSize='lg'>Recibidos</Text>
          {itemsRecibidos?.map((p) => (
            <Flex
              key={p.id + '-confirmed-pedido-id-key'}
              fontSize='sm'
              justify='space-between'
              gap={1}
            >
              <Flex align='center' gap={2}>
                <Icon
                  title={p.nombre}
                  color={checkColor}
                  fontSize='xl'
                  as={MdCheckCircle}
                />
                <Text>{p.nombre}</Text>
              </Flex>
              <Text minW='40px' fontWeight='bold'>
                {p.unidades} {p.medida}
              </Text>
            </Flex>
          ))}
          {(!itemsRecibidos || itemsRecibidos.length === 0) && (
            <Text fontSize='sm' fontStyle='italic' px={1}>
              No se recibieron productos
            </Text>
          )}
          <Divider my={2} borderColor='gray.500' />
          <Text fontSize='lg'>Pendientes</Text>
          {itemsPendientes.map((p) => (
            <Flex
              key={p.id + '-listed-pedido-id-key'}
              fontSize='sm'
              justify='space-between'
              gap={1}
            >
              <Flex align='center' gap={2}>
                <Icon
                  title={p.nombre}
                  color={pendienteColor}
                  fontSize='xl'
                  as={TiWarning}
                />
                <Text>{p.nombre}</Text>
              </Flex>
              <Text minW='40px' fontWeight='bold'>
                {p.unidades} {p.medida}
              </Text>
            </Flex>
          ))}
          {itemsPendientes.length === 0 && (
            <Text fontSize='sm' fontStyle='italic' px={1}>
              No hay productos pendientes
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex justifyContent='center' my={10} gap={4}>
        <ConfirmarCompraModal
          loading={loadingUpdate}
          update={updateCompra}
          pedido={currentMov}
          disclosure={disclosure}
        />
        {showDelete && CheckAdminRol(user?.rol) && (
          <DeleteModal
            textContent='Eliminar'
            title='Pedido'
            nombre={`${currentMov.id} (${estado})`}
            size='md'
            loadingForm={loadingDelete}
            DeleteProp={deleteFuncCompra}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default MovimientoCardCompra;
