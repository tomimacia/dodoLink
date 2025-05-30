import dateTexto from '@/helpers/dateTexto';
import useGetUsers from '@/hooks/users/useGetUsers';
import { Estados, EstadosCompra, EstadoType, PedidoType } from '@/types/types';
import {
  CheckCircleIcon,
  InfoOutlineIcon,
  WarningIcon
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import HistorialCambiosEnCurso from './HistorialCambiosEnCurso';

const VerMovimientosModal = ({
  currentEstado,
  pedido,
  isPago,
}: {
  currentEstado: EstadoType;
  pedido: PedidoType;
  isPago: boolean;
}) => {
  //Arrow con movimiento
  // const ArrowIconShow = ({ estado }: { estado: EstadoType }) => {
  //   if (estado === 'Finalizado') return <></>;
  //   const isEstado = estado === currentEstado;
  //   if (isEstado) {
  //     return (
  //       <motion.div
  //         style={{
  //           display: 'flex',
  //           marginTop: '4px',
  //           marginBottom: '4px',
  //           justifyContent: 'center',
  //           filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
  //         }}
  //         animate={{ y: [-0.5, 0.5, -0.5] }}
  //         transition={{ duration: 1, repeat: Infinity }}
  //       >
  //         <ArrowDownIcon fontSize='xs' color='blue.500' />
  //       </motion.div>
  //     );
  //   }
  //   return (
  //     <Flex my={1} justify='center'>
  //       <ArrowDownIcon fontSize='xs' />
  //     </Flex>
  //   );
  // };
  const { users } = useGetUsers();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const colorInicializado = useColorModeValue('blue.600', 'blue.300');
  const colorID = useColorModeValue('gray.500', 'gray.300');
  const cardBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  const RenderMovimiento = ({ estado }: { estado: EstadoType }) => {
    const movimiento = pedido.movimientos[estado];
    const isEstado = estado === currentEstado;
    if (!movimiento?.fecha || !movimiento?.admin)
      return (
        <>
          <Box
            borderWidth={1}
            borderRadius='lg'
            borderColor={borderColor}
            bg={cardBg}
            p={4}
            w='100%'
            mb={4}
          >
            <Flex align='center' justify='space-between' mb={2}>
              <Heading size='sm'>{estado}</Heading>
              <Icon as={WarningIcon} color='orange.400' />
            </Flex>
            <Text fontSize='sm'>No realizado aún</Text>
          </Box>
          {/* <ArrowIconShow estado={estado} /> */}
        </>
      );

    const usuario = users?.find((u) => u.id === movimiento.admin);
    const fechaData = dateTexto(movimiento.fecha.seconds);

    return (
      <>
        <Box
          key={estado + 'historial-mov-key'}
          borderWidth={1}
          borderRadius='lg'
          borderColor={borderColor}
          bg={cardBg}
          p={4}
          w='100%'
          boxShadow={isEstado ? '0 0 2px' : 'none'}
        >
          <Flex align='center' justify='space-between' mb={2}>
            <Heading size='sm'>{estado}</Heading>
            <Icon as={CheckCircleIcon} color='green.400' />
          </Flex>
          <Text fontSize='sm'>
            <b>Fecha:</b> {fechaData.textoDate}
          </Text>
          <Text fontSize='sm'>
            <b>Hora:</b> {fechaData.hourDate} hs
          </Text>
          <Text fontSize='sm'>
            <b>Responsable:</b> {usuario?.nombre} {usuario?.apellido}
          </Text>
          {estado !== 'Pendiente' && !(estado === 'En curso' && !isPago) && (
            <Flex flexDir='column' gap={1}>
              <Text fontSize='sm'>
                <b>Actualizaciones</b>{' '}
                {!movimiento?.cambios ? ': Sin Actualizaciones' : ''}
              </Text>
              <HistorialCambiosEnCurso
                estado={estado}
                movimiento={movimiento}
                isPago={isPago}
              />
            </Flex>
          )}
        </Box>
        {/* <ArrowIconShow estado={estado} /> */}
      </>
    );
  };

  const inicial = pedido.movimientos.Inicializado;
  const inicialUser = users?.find((u) => u.id === inicial.admin);
  const inicialFecha = dateTexto(inicial.fecha.seconds);
  const finalEstados = !pedido.isPago ? Estados : EstadosCompra;

  return (
    <Flex>
      <Button
        w='fit-content'
        size='xs'
        bg='transparent'
        _hover={{ opacity: 0.8, textDecor: 'underline' }}
        onClick={onOpen}
      >
        Ver Movimientos
      </Button>

      <Modal
        size='3xl'
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex={10} _hover={{ bg: 'blackAlpha.300' }} />
          <ModalHeader>
            <Flex direction='column'>
              <Text fontSize='sm' color={colorID}>
                Pedido ID: {pedido.id}
              </Text>
              <Heading size='md'>Historial de Movimientos</Heading>
            </Flex>
          </ModalHeader>

          <ModalBody pb={6}>
            <Box
              borderWidth={1}
              borderRadius='lg'
              borderColor={borderColor}
              bg={cardBg}
              p={4}
              mb={4}
              w='100%'
            >
              <Flex align='center' justify='space-between' mb={2}>
                <Heading size='sm' color={colorInicializado}>
                  Inicializado
                </Heading>
                <Icon as={InfoOutlineIcon} color='blue.400' />
              </Flex>
              <Text fontSize='sm'>
                <b>Fecha:</b> {inicialFecha.textoDate}
              </Text>
              <Text fontSize='sm'>
                <b>Hora:</b> {inicialFecha.hourDate} hs
              </Text>
              <Text fontSize='sm'>
                <b>Responsable:</b> {inicialUser?.nombre}{' '}
                {inicialUser?.apellido}
              </Text>
            </Box>
            {/* <ArrowIconShow estado='Inicializado' /> */}
            <Stack spacing={4}>
              {finalEstados
                .filter((e) => e !== 'Inicializado')
                .map((estado) => (
                  <RenderMovimiento
                    estado={estado}
                    key={estado + 'historial-mov-key'}
                  />
                ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default VerMovimientosModal;
