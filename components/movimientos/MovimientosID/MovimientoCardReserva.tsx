import CopyButton from '@/components/CopyButton';
import DeleteModal from '@/components/DeleteModal';
import EstadoStepsReserva from '@/components/movimientos/MovimientosID/EstadoStepsReserva';
import NotAuthorized from '@/components/Navigation/NotAuthorized';
import NotFoundPage from '@/components/NotFoundPage';
import { CheckAdminRol } from '@/data/data';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import dateTexto from '@/helpers/dateTexto';
import { scrollIntoTheView } from '@/helpers/scrollIntoTheView';
import usePedidosForm from '@/hooks/usePedidosForm';
import useGetUsers from '@/hooks/users/useGetUsers';
import { NotaType, PedidoType, ProductoType } from '@/types/types';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { MdLocationPin } from 'react-icons/md';
import MapEmbed from '../EmbedMap';
import ConfirmarReservaModal from './ConfimarPedidoModal/ConfirmarReservaModal';
import QRCodeLabel from './QRCodeLabel';
import VerMovimientosModal from './VerMovimientosModal';
import AsignarPedido from '../AsignarPedido';

const MovimientoCardReserva = ({ movimiento }: { movimiento: PedidoType }) => {
  const {
    user,
    productos,
    estado,
    loadingUpdate,
    loadingDelete,
    currentMov,
    updatePedido,
    showDeleted,
    deleteFunc,
    disclosure,
    volverAInicializado,
    asignarPedidoPendiente,
  } = usePedidosForm(movimiento);
  const {
    detalle,
    items,
    cliente,
    isRetiro,
    id,
    isPago,
    mapCoords,
    movimientos,
    tramo,
    nota,
  } = currentMov ?? {};
  const [loadingNota, setLoadingNota] = useState(false);
  const customGrayBG = useColorModeValue('gray.50', 'gray.700');
  const customGray = useColorModeValue('gray.600', 'gray.200');
  const alertColors = {
    color: useColorModeValue('yellow.800', 'white'),
    bg: useColorModeValue('yellow.50', 'yellow.800'),
    variant: useColorModeValue('solid', 'outline'),
  };
  const router = useRouter();
  const { users } = useGetUsers();
  // Check si el usuario tiene el pedido en curso para Cuadrilla
  const hasReserva = movimientos?.['En curso'].admin === user?.id;
  const isCuadrilla = !CheckAdminRol(user?.rol);
  if (showDeleted) {
    return (
      <NotFoundPage
        content='El movimiento que buscás no existe o fue eliminado.'
        title='Movimiento no encontrado'
      />
    );
  }
  if (
    isCuadrilla &&
    (isRetiro || // caso 2
      (estado !== 'Pendiente' && !hasReserva)) // caso 1
  ) {
    return <NotAuthorized />;
  }
  const showDelete =
    user?.rol === 'Superadmin' ||
    ['En curso', 'Finalizado'].every((e) => e !== estado);
  const lastUser = users?.find((u) => u.id === movimientos[estado].admin);
  const handleNota = async () => {
    setLoadingNota(true);
    try {
      const enCurso = (await getSingleDoc('movimientos', 'enCurso')) as any;
      const newNotas = enCurso.notas.map((n: NotaType) => {
        if (n.id === id) return { ...n, vistoPor: [...n.vistoPor, user?.id] };
        return n;
      });
      await setSingleDoc('movimientos', 'enCurso', {
        notas: newNotas,
      });
      router.push(
        `/Reservas/Carga?id=${id}&servicio=${cliente}&nota=${JSON.stringify(
          nota
        )}${mapCoords && `&mapCoords=${mapCoords}`}`
      );
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoadingNota(false);
    }
  };
  return (
    <Flex gap={5} flexDir='column'>
      <Stack spacing={1}>
        <Flex align='center' justify='space-between'>
          <Flex gap={3} align='center'>
            <Text fontSize='sm' color={customGray}>
              {isRetiro ? 'Retiro' : 'Reserva'} -{' '}
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
        {!isCuadrilla && estado === "Pendiente" && (
          <AsignarPedido asignarPedidoPendiente={asignarPedidoPendiente} />
        )}
        <Text fontSize='sm'>
          <b>Fecha:</b>{' '}
          {dateTexto(movimientos?.Inicializado?.fecha.seconds, true).numDate} -{' '}
          {dateTexto(movimientos?.Inicializado?.fecha.seconds).hourDate} HS
        </Text>
        {lastUser && (
          <Text fontSize='sm'>
            <b>Último movimiento:</b> {lastUser?.nombre} {lastUser?.apellido}
          </Text>
        )}
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

      {nota && nota.length > 0 && (
        <Alert
          status='warning'
          variant='left-accent'
          borderRadius='md'
          boxShadow='lg'
          p={5}
          bg={alertColors.bg}
          color={alertColors.color}
          flexDirection='column'
          alignItems='flex-start'
          gap={3}
        >
          <Flex flexDir='column' gap={1}>
            <Flex align='center' gap={2}>
              <AlertIcon />
              <AlertTitle fontSize='lg' fontWeight='bold'>
                Nota de la reserva
              </AlertTitle>
            </Flex>
            {lastUser && (
              <Text fontStyle='italic' textDecor='underline' fontSize='sm'>
                {lastUser?.nombre} {lastUser?.apellido}
              </Text>
            )}
          </Flex>
          <Divider />
          <Flex flexDir='column' gap={1}>
            {nota.map((linea, i) => (
              <Text key={i}>{linea}</Text>
            ))}
          </Flex>

          <Button
            onClick={handleNota}
            mt={3}
            isLoading={loadingNota}
            colorScheme='yellow'
            variant={alertColors.variant}
            size='sm'
            alignSelf='flex-end'
          >
            Cargar nueva reserva
          </Button>
        </Alert>
      )}

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
          volverAInicializado={volverAInicializado}
          productos={productos || []}
          loading={loadingUpdate}
          disclosure={disclosure}
          update={(
            newPedido: PedidoType,
            newItems: ProductoType[],
            sobrantes: ProductoType[]
          ) => updatePedido(id, newPedido, newItems, sobrantes)}
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
