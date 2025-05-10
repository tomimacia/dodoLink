import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import capitalizeFirst from '@/helpers/capitalizeFirst';
import { CargarReserva } from '@/helpers/cobros/ConfirmFunctions';
import useGetProductos from '@/hooks/data/useGetProductos';
import useGetClientes from '@/hooks/useGetClientes';
import { ProductoType } from '@/types/types';
import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { addMonths } from 'date-fns';
import { useState } from 'react';

const AltaCliente = () => {
  const initialForm = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    domicilio: '',
    DNI: '',
    tipo: 'Cliente',
    ingresoVencido: null,
  };
  const { productos } = useGetProductos();
  const { setClientes, clientes } = useGetClientes();
  // const [recibirEmail, setrecibirEmail] = useState(true);
  const [cuota, setCuota] = useState<ProductoType | null>(null);
  const [form, setForm] = useState<any>(initialForm);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const { nombre, DNI, apellido, email, telefono, domicilio, tipo } = form;
    const test = !DNI || !nombre || !apellido;
    if (test)
      return toast({
        status: 'error',
        title: 'Error',
        isClosable: true,
        duration: 5000,
        description: 'Completa los campos obligatorios',
      });
    if (!cuota) {
      return toast({
        status: 'error',
        title: 'Error',
        isClosable: true,
        duration: 5000,
        description: 'Completá el tipo de pago',
      });
    }
    setLoading(true);
    try {
      const checkClient = (await getSingleDoc('clientes', DNI)) as any;
      if (checkClient) {
        return toast({
          title: 'Ya registrado',
          description: `DNI: ${DNI} ya está registrado para ${checkClient.nombre} ${checkClient.apellido}`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
      const formatName = (str: string) => {
        const words = str.trim().toLowerCase().split(' ');
        return words
          .map((word) => capitalizeFirst(word.toLowerCase()))
          .join(' ');
      };
      const newClient = {
        nombre: formatName(nombre),
        apellido: formatName(apellido),
        email: email.toLowerCase(),
        telefono: Number(telefono),
        domicilio,
        saldo: 0,
        // recibirEmail,
        DNI: Number(DNI),
        id: DNI,
        creadorID: user?.id || '',
        createdAt: new Date(),
        tipo,
        ingresoVencido: null,
        vencimiento: addMonths(new Date(), 1),
        activo: true,
      };

      await setSingleDoc('clientes', DNI, newClient);
      const newClientes = [...clientes, { ...newClient }];
      setClientes(newClientes);

      const newMovimiento = {
        tipoDePago:
          cuota && cuota.codigo.some((c) => c === 144036631405)
            ? 'Efectivo'
            : 'Mercadopago',
        destinatario: 'Cliente',
        cliente: {
          nombre: newClient.nombre,
          DNI: newClient.DNI,
          apellido: newClient.apellido,
          id: newClient.id,
          saldo: 0,
          vencimiento: newClient.vencimiento,
          ingresoVencido: null,
        },
        creadorID: user?.id,
        items: [{ ...cuota, nombre: `${cuota?.nombre}-ALTA`, unidades: 1 }],
        fecha: new Date(),
      };
      await CargarReserva(newMovimiento);

      toast({
        status: 'success',
        title: 'Éxito',
        isClosable: true,
        duration: 5000,
        description: `Cliente registrado exitosamente`,
      });
      setForm(initialForm);
      setCuota(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const cuotas =
    productos && productos.length > 0
      ? productos?.filter((p) =>
          p?.codigo?.some((c) => c === 144036631405 || c === 793288805789)
        )
      : [];

  return (
    <Flex flexDir='column' gap={2}>
      <Heading size='md'>Alta de Clientes</Heading>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 10,
          width: '100%',
          maxWidth: '400px',
        }}
        onSubmit={onSubmit}
      >
        <Text>*Nombre:</Text>
        <Input
          onChange={onChange}
          name='nombre'
          type='text'
          borderColor='gray'
          size='sm'
          borderRadius='5px'
          value={form.nombre}
          autoComplete='off'
          formNoValidate
        />
        <Text>*Apellido:</Text>
        <Input
          onChange={onChange}
          name='apellido'
          type='text'
          borderColor='gray'
          size='sm'
          value={form.apellido}
          autoComplete='off'
          formNoValidate
          borderRadius='5px'
        />
        <Text>*DNI:</Text>
        <Input
          onChange={onChange}
          name='DNI'
          type='number'
          formNoValidate
          autoComplete='off'
          onKeyDown={(e) => {
            if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onWheel={(e: any) => e.target.blur()}
          borderColor='gray'
          size='sm'
          borderRadius='5px'
          value={form.DNI}
        />
        <Text>Tipo:</Text>
        <Select
          onChange={onChange}
          name='tipo'
          required
          borderColor='gray'
          size='sm'
          borderRadius='5px'
          value={form.tipo}
        >
          <option value='Cliente'>Cliente</option>
          <option value='Profe'>Profe</option>
        </Select>
        <Text>Email:</Text>
        <Input
          onChange={onChange}
          name='email'
          type='email'
          formNoValidate
          autoComplete='off'
          value={form.email}
          borderColor='gray'
          size='sm'
          borderRadius='5px'
        />
        <Text>Tel:</Text>
        <Input
          onChange={onChange}
          name='telefono'
          type='number'
          formNoValidate
          autoComplete='off'
          onKeyDown={(e) => {
            if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onWheel={(e: any) => e.target.blur()}
          borderColor='gray'
          size='sm'
          value={form.telefono}
          borderRadius='5px'
        />
        <Text>Domicilio:</Text>
        <Input
          onChange={onChange}
          name='domicilio'
          type='text'
          borderColor='gray'
          size='sm'
          autoComplete='off'
          formNoValidate
          value={form.domicilio}
          borderRadius='5px'
        />
        {/* <Flex align='center' justify='space-between'>
          <Text>Acepta recibir emails:</Text>

          <Switch
            isChecked={recibirEmail}
            onChange={() => setrecibirEmail((prev) => !prev)}
          />
        </Flex> */}
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
        </Flex>
        <Button
          type='submit'
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          alignSelf='center'
          _hover={{ opacity: 0.65 }}
          isLoading={loading}
        >
          Aceptar
        </Button>
      </form>
    </Flex>
  );
};

export default AltaCliente;
