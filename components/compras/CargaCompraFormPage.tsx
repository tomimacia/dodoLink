import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import {
  CargarCompra,
  ConfirmValidation,
} from '@/helpers/cobros/ConfirmFunctions';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import CompraDrawer from '../movimientos/CobraFormComps/CompraDrawer';
import ProductosTable from '../movimientos/CobraFormComps/ProductosTable';
import TitleSearchYItem from '../movimientos/CobraFormComps/TitleSearchYItem';

const CargaCompraFormPage = () => {
  const {
    items,
    resetFilters,
    setCliente,
    setDetalle,
    setIsPago,
    detalle,
    cliente,
    isPago,
  } = useCobrarFormContext();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    setIsPago(true);
  }, []);
  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const formatItem = (item: ProductoType) => {
    const { creadorID, createdAt, ...rest } = item;
    return rest;
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
        movimientos,
        creadorID: user?.id,
        items: items.map((i) => formatItem(i)),
        isPago: true,
        vistoPor: [],
      };
      await CargarCompra(newMovimiento);
      toast({
        title: 'Éxito',
        description: 'Compra registrada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetFilters();
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
    ConfirmarCompra();
  };

  return (
    <Flex p={[1, 2, 2, 3, 3]} minH='50vh' maxW='700px' gap={5} flexDir='column'>
      <Heading as='h2' fontSize={24}>
        Carga de Compra
      </Heading>
      <FormControl isRequired>
        <FormLabel>Nombre de la Compra</FormLabel>
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
      <CompraDrawer />
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

export default CargaCompraFormPage;
