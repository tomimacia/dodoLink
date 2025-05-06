import CopyButton from '@/components/CopyButton';
import DeleteModal from '@/components/DeleteModal';
import EstadoSteps from '@/components/ingresos/EstadoSteps';
import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { getEstado } from '@/helpers/cobros/getEstado';
import dateTexto from '@/helpers/dateTexto';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import useGetUsers from '@/hooks/users/useGetUsers';
import { Estados, MovimientosType, PedidoType } from '@/types/types';
import {
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { MdLocationPin } from 'react-icons/md';
import MapEmbed from '../EmbedMap';
import ConfirmarPedidoModal from './ConfirmarPedidoModal';
import QRCodeLabel from './QRCodeLabel';
import VerMovimientosModal from './VerMovimientosModal';
import { scrollIntoTheView } from '@/helpers/scrollIntoTheView';
const MovimientoCard = ({ movimiento }: { movimiento: PedidoType }) => {
  const { reservas } = useOnCurso();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { user } = useUser();
  const [currentMov, setCurrentMov] = useState(movimiento);
  useEffect(() => {
    const newMov = reservas?.find((r) => r.id === movimiento.id) || {
      ...movimiento,
      estado: 'Finalizado',
    };
    setCurrentMov(newMov);
  }, [reservas]);
  const customGrayBG = useColorModeValue('gray.50', 'gray.700');
  const {
    detalle,
    items,
    cliente,
    id,
    isPago,
    mapCoords,
    creadorID,
    movimientos,
    tramo,
  } = currentMov;
  const { users } = useGetUsers();
  const estado = getEstado(movimientos);
  const toast = useToast();
  const updatePedido = async (id: string) => {
    if (estado === 'Finalizado' || !reservas) {
      toast({
        title: 'Finalizado',
        description: 'No se puede actualizar un pedido finalizado',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const fecha = formatearFecha(id);
    const newEstado = Estados[Estados.indexOf(estado) + 1];
    setLoadingUpdate(true);
    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      fecha
    )) as MovimientosType;
    const field = isPago ? 'compras' : 'reservas';
    const updatedReservas = (id: string, arr: PedidoType[]) => {
      const newReservas = arr.map((r) => {
        if (r.id === id)
          return {
            ...r,
            movimientos: {
              ...movimientos,
              [newEstado]: {
                fecha: Timestamp.now(),
                admin: user?.id,
              },
            },
          };
        return r;
      });
      return newReservas;
    };
    try {
      await setSingleDoc('movimientos', fecha, {
        [field]: updatedReservas(id, movimientoFetched.reservas),
      });
      await setSingleDoc('movimientos', 'enCurso', {
        [field]:
          newEstado === 'Finalizado'
            ? reservas?.filter((d) => d.id !== id)
            : updatedReservas(id, reservas),
      });
      toast({
        title: 'Éxito',
        description: 'Pedido actualizado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingUpdate(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };
  const creador = users?.find((user) => user.id === creadorID);
  const deleteFunc = async () => {
    return;
  };
  const example = false;
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
          <MdLocationPin
            onClick={() => scrollIntoTheView('embed-location')}
            cursor='pointer'
          />
        </Flex>
        <Heading fontWeight='normal' size='lg'>
          <strong> {cliente}</strong>
        </Heading>
        <Text fontStyle='italic'>
          Fecha:{' '}
          <b>
            {dateTexto(movimientos?.Inicializado?.fecha.seconds, true).numDate}
          </b>{' '}
          - {dateTexto(movimientos?.Inicializado?.fecha.seconds).hourDate} HS
        </Text>
        {tramo !== 0 && tramo && (
          <Text fontStyle='italic'>
            Tramo: <b>{tramo} Mts.</b>
          </Text>
        )}
      </Flex>
      <Flex flexDir='column'>
        <EstadoSteps estado={estado} />
        <VerMovimientosModal pedido={currentMov} />
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
          <Text fontSize='sm'>{detalle || 'Sin descripción'}</Text>
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
              fontSize='md'
              justify='space-between'
              borderBottom='1px solid #BEBEBE'
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
          color='black'
        >
          <QRCodeLabel pedido={currentMov} />
        </Flex>
        <Flex id='embed-location' w='100%'>
          <MapEmbed hideButtons src={mapCoords} />
        </Flex>
      </Flex>
      <Flex justifyContent='center' my={10} gap={4}>
        <ConfirmarPedidoModal
          loading={loadingUpdate}
          update={() => updatePedido(id)}
          pedido={currentMov}
        />
        {CheckAdminRol(user?.rol) && (
          <DeleteModal
            textContent='Eliminar'
            title='Pedido'
            nombre={`${currentMov.id} (${estado})`}
            size='md'
            loadingForm={loadingUpdate}
            DeleteProp={deleteFunc}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default MovimientoCard;
