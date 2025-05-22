import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import {
  CargarCompra,
  CargarReserva,
  ConfirmValidation,
} from '@/helpers/cobros/ConfirmFunctions';
import { extractSrcFromIframe } from '@/helpers/extractSrcFromIframe';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useRef, useState } from 'react';
import ProductosTable from '../movimientos/CobraFormComps/ProductosTable';
import TitleSearchYItem from '../movimientos/CobraFormComps/TitleSearchYItem';
import MapEmbed from '../movimientos/EmbedMap';

const CargaReservaFormPage = () => {
  const {
    items,
    resetFilters,
    setCliente,
    setDetalle,
    detalle,
    cliente,
    isPago,
  } = useCobrarFormContext();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [hasTramo, setHasTramo] = useState(true);
  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const [embedValue, setEmbedValue] = useState('');
  const [tramo, setTramo] = useState<number | null>(null);
  const [embed, setEmbed] = useState('');
  const handleEmbedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmbedValue(value);

    // Si el input contiene un iframe válido, lo extraemos y lo seteamos
    if (value.includes('https') || value.includes('src=')) {
      const src = extractSrcFromIframe(value);
      if (src) {
        setEmbed(src);
        setEmbedValue(''); // Limpiar input luego de confirmar
        toast({
          title: 'Mapa agregado',
          description: 'El iframe fue detectado y procesado automáticamente',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

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
    if (hasTramo && !tramo) {
      toast({
        title: 'Error',
        description: 'Debes indicar el tramo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    const itemsSinStock = items.filter(
      (item) => (item.unidades || 0) > item.cantidad
    );
    if (itemsSinStock.length > 0) {
      setLoading(false);
      return toast({
        title: 'Sin Stock',
        description: `No hay stock para alguno de los productos: ${itemsSinStock
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
        detalle: detalle.split('\n'),
        cliente,
        creadorID: user?.id,
        items: items.map((i) => formatItem(i)),
        movimientos,
        isPago: false,
        mapCoords: embed,
        vistoPor: [],
        tramo: hasTramo ? tramo : null,
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
      setTramo(null);
      setEmbed('');
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
    ConfirmarReserva();
  };

  return (
    <Flex p={[1, 2, 2, 3, 3]} minH='50vh' maxW='700px' gap={5} flexDir='column'>
      <Heading as='h2' fontSize={24}>
        Carga de Reserva
      </Heading>
      <FormControl isRequired>
        <FormLabel>Cliente</FormLabel>
        <Input
          placeholder='Agregar nombre'
          borderRadius={5}
          borderColor='gray'
          size='sm'
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Detalle</FormLabel>
        <Textarea
          placeholder='Agregar detalle'
          borderRadius={5}
          borderColor='gray'
          size='sm'
          value={detalle}
          onChange={(e) => setDetalle(e.target.value as string)}
        />
      </FormControl>

      <Flex gap={2} align='center'>
        <Switch
          isChecked={hasTramo}
          onChange={() =>
            setHasTramo((prev) => {
              if (prev) {
                setTramo(null);
              }
              return !prev;
            })
          }
        />
        <Text fontWeight='bold'>Tramo (mts):</Text>
        <Input
          borderColor='gray'
          size='sm'
          borderRadius={5}
          placeholder='Mts'
          type='number'
          isDisabled={!hasTramo}
          onKeyDown={(e) => {
            if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onWheel={(e: any) => e.target.blur()}
          value={!hasTramo ? '' : tramo || ''}
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
            placeholder='Insertar iframe del mapa'
            onChange={handleEmbedChange}
          />
          <Button
            onClick={() => {
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
            }}
            size='sm'
            bg='blue.700'
            color='white'
          >
            Confirmar
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

export default CargaReservaFormPage;
