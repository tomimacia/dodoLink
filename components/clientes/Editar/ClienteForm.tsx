import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { toFirestoreTimestamp } from '@/helpers/cobros/toFirestoreTimestamp';
import useGetClientes from '@/hooks/useGetClientes';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { addDays, compareAsc } from 'date-fns';
import React, { useState } from 'react';

const ClienteForm = ({
  cliente,
  onClose,
  setNewCliente,
}: {
  cliente: any;
  onClose: () => void;
  setNewCliente?: (newCliente: any) => void;
}) => {
  const [formData, setFormData] = useState({
    ...cliente,
    vencimiento: cliente.vencimiento
      ? (() => {
          const date = new Date(cliente.vencimiento.seconds * 1000);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura MM
          const day = String(date.getDate()).padStart(2, '0'); // Asegura DD
          return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
        })()
      : '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const { clientes, setClientes } = useGetClientes();
  const submit = async (e: any) => {
    e.preventDefault();
    if (JSON.stringify(formData) === JSON.stringify(cliente))
      return toast({
        title: 'No hay cambios',
        description: 'No se realizaron cambios en el cliente',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });

    setLoading(true);
    try {
      const DNIExists = (await getSingleDoc('clientes', DNI + '')) as any;
      if (DNIExists && DNIExists.DNI !== cliente.DNI) {
        setFormData((prev: any) => ({
          ...prev,
          DNI: cliente.DNI,
        }));
        return toast({
          title: 'DNI duplicado',
          description: `DNI ${DNI} ya registrado para ${DNIExists.nombre} ${DNIExists.apellido}`,
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
      }
      const newVencimiento = addDays(new Date(vencimiento), 1);
      const isVencido = compareAsc(newVencimiento, new Date()) === -1;
      const newCliente = {
        ...formData,
        vencimiento: newVencimiento,
        saldo: Number(saldo),
        telefono: Number(telefono),
        DNI: Number(DNI),
        ingresoVencido: isVencido
          ? { nanoseconds: 0, seconds: newVencimiento.getTime() / 1000 }
          : null,
      };
      await setSingleDoc('clientes', cliente.id, newCliente);
      const newClientes = clientes.map((c) => {
        if (c.id === newCliente.id) return newCliente;
        return c;
      });
      setClientes(newClientes);
      if (setNewCliente)
        setNewCliente({
          ...newCliente,
          vencimiento: toFirestoreTimestamp(vencimiento),
        });
      toast({
        title: 'Actualizado',
        description: `${newCliente.nombre} actualizado con éxito`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar editar el cliente',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const {
    nombre,
    apellido,
    email,
    telefono,
    domicilio,
    saldo,
    // recibirEmail,
    DNI,
    vencimiento,
    tipo,
  } = formData ?? {};
  console.log(vencimiento);
  return (
    <Flex flexDir='column' gap={4}>
      <Heading textAlign='center' size='md'>
        {cliente.nombre} {cliente.apellido}
      </Heading>
      <Text>
        DNI: <b style={{ fontStyle: 'italic' }}>{DNI}</b>
      </Text>
      <form onSubmit={submit}>
        <Flex p={2} mt={2} flexDir='column' gap={2}>
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Nombre</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='nombre'
              maxW='300px'
              autoComplete='off'
              formNoValidate
              value={nombre}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Apellido</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='apellido'
              autoComplete='off'
              formNoValidate
              maxW='300px'
              value={apellido}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Saldo Cta/Cte</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='saldo'
              autoComplete='off'
              formNoValidate
              type='number'
              onWheel={(e: any) => e.target.blur()}
              maxW='300px'
              value={saldo}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />

          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Tel</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='telefono'
              autoComplete='off'
              formNoValidate
              onWheel={(e: any) => e.target.blur()}
              type='number'
              maxW='300px'
              value={telefono}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Vencimiento</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='vencimiento'
              autoComplete='off'
              formNoValidate
              type='date'
              maxW='300px'
              value={vencimiento}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />

          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Email</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='email'
              autoComplete='off'
              formNoValidate
              maxW='300px'
              value={email}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Domicilio</FormLabel>
            <Input
              borderColor='gray'
              borderRadius={5}
              size='sm'
              name='domicilio'
              autoComplete='off'
              formNoValidate
              maxW='300px'
              value={domicilio}
              onChange={handleChange}
            />
          </FormControl>
          <Divider borderColor='gray' />
          {/* Medida */}
          <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel>Tipo</FormLabel>
            <Select
              borderColor='gray'
              borderRadius={5}
              size='sm'
              w='100%'
              cursor='pointer'
              maxW='150px'
              name='Tipo'
              value={tipo}
              onChange={handleChange}
            >
              <option value='Cliente'>Cliente</option>
              <option value='Profe'>Profe</option>
            </Select>
          </FormControl>
          <Divider borderColor='gray' />

          {/* <FormControl
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <FormLabel mb='0'>Recibir Emails</FormLabel>
            <Switch
              isChecked={recibirEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recibirEmail: e.target.checked,
                }))
              }
            />
          </FormControl> */}
          {/* Código */}
        </Flex>
        <Flex my={3} justify='space-around'>
          <Button
            _hover={{ opacity: 0.65 }}
            color='white'
            type='submit'
            bg='green.700'
            size='sm'
            isLoading={loading}
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
      </form>
    </Flex>
  );
};

export default ClienteForm;
