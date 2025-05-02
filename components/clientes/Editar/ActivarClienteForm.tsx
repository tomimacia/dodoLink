import { useUser } from '@/context/userContext';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { addDots } from '@/helpers/addDots';
import { CargarIngreso } from '@/helpers/cobros/ConfirmFunctions';
import { toFirestoreTimestamp } from '@/helpers/cobros/toFirestoreTimestamp';
import dateTexto from '@/helpers/dateTexto';
import useGetProductos from '@/hooks/data/useGetProductos';
import useGetClientes from '@/hooks/useGetClientes';
import { ClientType, ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Heading,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { addMonths } from 'date-fns';
import { useState } from 'react';

const ActivarClienteForm = ({
  cliente,
  onClose,
  setNewCliente,
}: {
  cliente: ClientType;
  onClose: () => void;
  setNewCliente?: (newCliente: ClientType) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [cuota, setCuota] = useState<ProductoType | null>(null);
  const { user } = useUser();
  const toast = useToast();
  const { getClientes } = useGetClientes();
  const newVenc = addMonths(new Date(), 1);
  const { productos } = useGetProductos();
  const formatedVenc = dateTexto(newVenc.getTime() / 1000)
    .numDate.split('/')
    .toReversed()
    .join('-');
  const cuotas =
    productos && productos.length > 0
      ? productos?.filter((p) =>
          p?.codigo?.some((c) => c === 144036631405 || c === 793288805789)
        )
      : [];
  const submit = async () => {
    if (!cuota)
      return toast({
        title: 'Error',
        description: 'Debes seleccionar un tipo de pago',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    setLoading(true);
    try {
      await setSingleDoc('clientes', cliente.id, {
        vencimiento: newVenc,
        activo: true,
      });
      await getClientes();
      const newMovimiento = {
        tipoDePago:
          cuota && cuota.codigo.some((c) => c === 144036631405)
            ? 'Efectivo'
            : 'Mercadopago',
        destinatario: 'Cliente',
        cliente: {
          nombre: cliente.nombre,
          DNI: cliente.DNI,
          apellido: cliente.apellido,
          id: cliente.id,
          saldo: cliente.saldo,
          vencimiento: cliente.vencimiento,
          ingresoVencido: null,
        },
        creadorID: user?.id,
        items: [{ ...cuota, unidades: 1 }],
        fecha: new Date(),
        total: cuota?.precio,
      };
      await CargarIngreso(newMovimiento);
      if (setNewCliente) {
        setNewCliente({
          ...cliente,
          vencimiento: toFirestoreTimestamp(formatedVenc),
          activo: true,
        });
      }
      toast({
        title: 'Cliente Reactivado',
        description: 'El cliente ha sido reactivado correctamente!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Hubo un error al reactivar el cliente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex flexDir='column' gap={4}>
      <Heading textAlign='center' size='md'>
        {cliente.nombre} {cliente.apellido}
      </Heading>
      <Text>
        DNI: <b style={{ fontStyle: 'italic' }}>{cliente.DNI}</b>
      </Text>
      <Text>
        Para confirmar la reactivación de cliente, seleccioná el tipo de pago y
        realizá el cobro.
      </Text>
      <Text fontSize='sm' fontStyle='italic'>
        Nuevo vencimiento:{' '}
        <b>{dateTexto(newVenc.getTime() / 1000).textoDate}</b>
      </Text>
      <Flex
        gap={3}
        flexDir='column'
        p={2}
        border='1px solid gray'
        borderRadius={10}
      >
        <Text>Tipo de Pago:</Text>
        <Select
          onChange={(e) => {
            const selectedCuota = cuotas.find((c) =>
              c.codigo.some((c) => c === Number(e.target.value))
            );
            if (selectedCuota) {
              setCuota(selectedCuota);
            } else setCuota(null);
          }}
          name='tipo'
          borderColor='gray'
          size='sm'
          cursor='pointer'
          borderRadius='5px'
          placeholder='Seleccionar'
          value={cuota?.codigo[0] ?? ''}
        >
          {cuotas.map((cuota) => (
            <option key={cuota.codigo + 'key'} value={cuota.codigo[0]}>
              {cuota.nombre}
            </option>
          ))}
        </Select>
        {cuota && <Text>Total: ${addDots(Number(cuota?.precio))}</Text>}
      </Flex>
      <Flex my={3} justify='space-around'>
        <Button
          _hover={{ opacity: 0.65 }}
          color='white'
          bg='green.700'
          size='sm'
          isLoading={loading}
          onClick={submit}
        >
          Confirmar
        </Button>
        <Button
          _hover={{ opacity: 0.65 }}
          onClick={onClose}
          color='white'
          bg='red.700'
          size='sm'
        >
          Cancelar
        </Button>
      </Flex>
    </Flex>
  );
};

export default ActivarClienteForm;
