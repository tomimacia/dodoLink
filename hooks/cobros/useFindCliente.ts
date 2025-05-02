import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { ClientType } from '@/types/types';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';

const useFindCliente = (
  setClienteSelected: (newCliente: ClientType) => void
) => {
  const [consultaCliente, setConsultaCliente] = useState('');
  const [loadingCliente, setLoadingCliente] = useState(false);
  const toast = useToast();
  const buscarCliente = async () => {
    if (!consultaCliente) return;
    if (consultaCliente.length < 7)
      return toast({
        title: 'Error',
        description: 'Ingresa un DNI válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    setLoadingCliente(true);
    try {
      const findCliente = (await getSingleDoc(
        'clientes',
        consultaCliente
      )) as ClientType;
      if (!findCliente || findCliente.activo === false) {
        return toast({
          title: 'Error',
          description: 'Cliente no registrado o inactivo',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setClienteSelected(findCliente);
      setConsultaCliente('');
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCliente(false);
    }
  };
  return { loadingCliente, buscarCliente, setConsultaCliente, consultaCliente };
};

export default useFindCliente;
