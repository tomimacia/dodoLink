import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import {
  ActualizarStock,
  CargarCompra,
  CargarReserva,
  ConfirmValidation,
} from '@/helpers/cobros/ConfirmFunctions';
import { extractSrcFromIframe } from '@/helpers/extractSrcFromIframe';
import { sendTelegramFaltantes } from '@/nodemailer/telegram';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useRef, useState } from 'react';
import ClienteYDetalle from './CobraFormComps/ClienteYDetalle';
import ProductosTable from './CobraFormComps/ProductosTable';
import TitleSearchYItem from './CobraFormComps/TitleSearchYItem';
import MapEmbed from './EmbedMap';

const CobrarForm = ({ onClose }: { onClose: () => void }) => {
  const {
    items,
    productos,
    setProductos,
    resetFilters,
    detalle,
    cliente,
    isPago,
  } = useCobrarFormContext();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingTest, setLoadingTset] = useState(false);
  const toast = useToast();

  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const [embedValue, setEmbedValue] = useState('');
  const [tramo, setTramo] = useState<number | null>(null);
  const [embed, setEmbed] = useState('');
  const formatItem = (item: ProductoType) => {
    const { creadorID, createdAt, ...rest } = item;
    return rest;
  };
  const ConfirmarReserva = async () => {
    setLoading(true);
    const isValidated = ConfirmValidation(
      detalle,
      cliente,
      items.length === 0,
      toast
    );
    if (!isValidated) {
      setLoading(false);
      return;
    }
    const itemsSinSotck = items.filter(
      (item) => (item.unidades || 0) > item.cantidad
    );
    if (itemsSinSotck.length > 0) {
      setLoading(false);
      return toast({
        title: 'Sin Stock',
        description: `No hay stock para alguno de los productos: ${itemsSinSotck
          .map((i) => i.nombre)
          .join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    const movimientos = {
      Inicializado: {
        fecha: Timestamp.now(),
        admin: user?.id,
      },
      Preparación: {
        fecha: null,
        admin: null,
      },
      Pendiente: {
        fecha: null,
        admin: null,
      },
      'En curso': {
        fecha: null,
        admin: null,
      },
      Finalizado: {
        fecha: null,
        admin: null,
      },
    };
    try {
      const newMovimiento = {
        detalle,
        cliente,
        creadorID: user?.id,
        items: items.map((i) => formatItem(i)),
        movimientos,
        isPago: false,
        mapCoords: embed,
        vistoPor: [],
        tramo,
      };
      await CargarReserva(newMovimiento);
      toast({
        title: 'Éxito',
        description: 'Reserva cargada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetFilters();
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Hubo un error al confirmar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const ConfirmarCompra = async () => {
    setLoading(true);
    const isValidated = ConfirmValidation(
      detalle,
      cliente,
      items.length === 0,
      toast
    );
    if (!isValidated) {
      setLoading(false);
      return;
    }
    const fecha = new Date();
    try {
      const newMovimiento = {
        detalle,
        cliente,
        creadorID: user?.id,
        items: items.map((i) => formatItem(i)),
        fecha,
        isPago: true,
        vistoPor: [],
      };
      await CargarCompra(newMovimiento);
      // Actualizar el stock
      await ActualizarStock(items, productos || [], setProductos, true);
      toast({
        title: 'Éxito',
        description: 'Egreso registrado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetFilters();
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Hubo un error al confirmar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const ConfirmarMovimiento = async () => {
    confirmButtonRef.current?.blur();
    isPago ? ConfirmarCompra() : ConfirmarReserva();
  };
  const addTest = async () => {
    const movimientos = {
      Inicializado: {
        fecha: Timestamp.now(),
        admin: user?.id,
      },
      Preparación: {
        fecha: null,
        admin: null,
      },
      Pendiente: {
        fecha: null,
        admin: null,
      },
      'En curso': {
        fecha: null,
        admin: null,
      },
      Finalizado: {
        fecha: null,
        admin: null,
      },
    };
    setLoading(true);
    try {
      const newMovimiento = {
        detalle: 'Detalle Test',
        cliente: 'Test',
        creadorID: user?.id,
        items: [
          {
            target: 800,
            medida: 'Un.',
            nombre: 'Test',
            codigo: [],
            id: 'zSRhXErDrgHUliqiV4kY',
            cantidadPorPack: 150,
            cantidad: 2000,
            empresa: 'dodoLink',
            unidades: 150,
          },
        ],
        movimientos,
        isPago: false,
        mapCoords:
          'https://www.google.com/maps/d/embed?mid=1UGQcECeYZBB9y5X0esAkNzFRU8PjlRo&ehbc=2E312F',
        vistoPor: [],
        tramo: 150,
      };
      console.log(newMovimiento.items[0]);
      await CargarReserva(newMovimiento);
      toast({
        title: 'Éxito',
        description: 'Reserva cargada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetFilters();
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Hubo un error al confirmar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const confirmMap = () => {
    const src = extractSrcFromIframe(embedValue);
    if (!src) {
      toast({
        title: 'Error',
        description: 'Ingresá un iframe válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setEmbed(src);
    setEmbedValue('');
  };
  const test = async () => {
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay productos seleccionados',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoadingTset(true);
    try {
      await sendTelegramFaltantes(items);
      toast({
        title: 'Éxito',
        description: 'Mensaje enviado al bot de Telegram',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoadingTset(false);
    }
  };
  return (
    <Flex minH='50vh' gap={3} flexDir='column'>
      <ClienteYDetalle />
      <Flex gap={2}>
        <Button
          onClick={test}
          size='sm'
          w='fit-content'
          color='white'
          bg='blue.700'
          isLoading={loadingTest}
          _hover={{ opacity: 0.7 }}
        >
          Test Telegram Bot
        </Button>
        {/* <Button
          onClick={addTest}
          size='sm'
          w='fit-content'
          color='white'
          bg='blue.700'
          isLoading={loading}
          _hover={{ opacity: 0.7 }}
        >
          Add Test
        </Button> */}
      </Flex>
      <Flex gap={2} align='center'>
        <Text fontWeight='bold'>Tramo (mts.):</Text>
        <Input
          borderColor='gray'
          size='sm'
          borderRadius={5}
          placeholder='Mts.'
          type='number'
          value={tramo || ''}
          onChange={(e) => setTramo(Number(e.target.value))}
          maxW='100px'
        />
      </Flex>
      {!embed && (
        <Flex align='center' gap={2}>
          <Input
            size='sm'
            maxW='600px'
            borderColor='gray'
            borderRadius={5}
            value={embedValue}
            placeholder='Insertar mapa html'
            onChange={(e) => setEmbedValue(e.target.value)}
          />
          <Button onClick={confirmMap} size='sm' bg='blue.700' color='white'>
            Confirm
          </Button>
        </Flex>
      )}
      <MapEmbed initialShow clean={() => setEmbed('')} src={embed} />
      <TitleSearchYItem />
      <ProductosTable />
      <Flex mt='auto' p={5} flexDir='column' gap={3}>
        <Button
          type='submit'
          mx='auto'
          ref={confirmButtonRef}
          w='50%'
          fontWeight='bold'
          size='sm'
          maxW='200px'
          mt={5}
          bg={fontColor}
          color='white'
          border='1px solid transparent'
          _hover={{ opacity: 0.7, border: '1px solid gray' }}
          isLoading={loading}
          onClick={ConfirmarMovimiento}
        >
          Confirmar
        </Button>
      </Flex>
    </Flex>
  );
};

export default CobrarForm;
