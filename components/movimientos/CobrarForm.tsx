import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import {
  ActualizarStock,
  CargarCompra,
  CargarReserva,
  ConfirmValidation,
} from '@/helpers/cobros/ConfirmFunctions';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import ClienteYDetalle from './CobraFormComps/ClienteYDetalle';
import ProductosTable from './CobraFormComps/ProductosTable';
import TitleSearchYItem from './CobraFormComps/TitleSearchYItem';
import MapEmbed from './EmbedMap';

const CobrarForm = ({
  onClose,
  getNewClient,
}: {
  onClose: () => void;
  getNewClient?: () => Promise<void>;
}) => {
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

  const toast = useToast();

  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const [embedValue, setEmbedValue] = useState('');
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
    const fecha = new Date();
    try {
      const newMovimiento = {
        detalle,
        cliente,
        creadorID: user?.id,
        items: items.map((i) => formatItem(i)),
        fecha,
        isPago: false,
        mapCoords: embed,
        estado: 'Inicializado',
        vistoPor: [],
      };
      await CargarReserva(newMovimiento);
      // Actualizar el stock
      await ActualizarStock(items, productos || [], setProductos, false);
      toast({
        title: 'Éxito',
        description: 'Ingreso registrado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetFilters();
      if (getNewClient) getNewClient();
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
  const confirmMap = () => {
    setEmbed(embedValue);
    setEmbedValue('');
  };
  return (
    <Flex minH='50vh' gap={3} flexDir='column'>
      <ClienteYDetalle />
      {!embed ? (
        <Flex align='center' gap={2}>
          <Input
            size='sm'
            maxW='600px'
            borderColor='gray'
            borderRadius={5}
            value={embedValue}
            placeholder='Ingresar mapa html'
            onChange={(e) => setEmbedValue(e.target.value)}
          />
          <Button onClick={confirmMap} size='sm' bg='blue.700' color='white'>
            Confirm
          </Button>
        </Flex>
      ) : (
        <Flex align='center' gap={2}>
          <Button
            onClick={() => setEmbed('')}
            size='xs'
            bg='red.700'
            color='white'
            _hover={{ opacity: 0.7 }}
          >
            Cancelar
          </Button>
        </Flex>
      )}
      <MapEmbed src={embed} />
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
