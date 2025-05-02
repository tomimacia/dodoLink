import { useClientsGraph } from '@/context/useClientsGraphContext';
import dateTexto from '@/helpers/dateTexto';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Flex, IconButton, useToast } from '@chakra-ui/react';
import { addDays, isToday, subDays } from 'date-fns';
import { ReactNode } from 'react';
const ClientesDateSelector = ({ children }: { children: ReactNode }) => {
  const { date, lapso, month, loading, setMonth, setDate } = useClientsGraph();
  const toast = useToast();
  const plusOneDay = () => {
    if (isToday(date)) {
      return toast({
        title: 'No puedes pasar al día siguiente',
        description: 'El día seleccionado es hoy',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
    setDate((prev) => addDays(prev, 1));
  };
  const minusOneDay = () => {
    if (dateTexto(date.getTime() / 1000).slashDate === '17-2-2025') {
      return toast({
        title: 'No puedes retroceder',
        description: 'No hay mas data hacia atrás (alta de sistema)',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
    setDate((prev) => subDays(prev, 1));
  };
  const nowMonth = new Date().getMonth();
  const minusMonth = () => {
    if (month <= 1)
      return toast({
        title: 'No puedes retroceder',
        description: 'El mes seleccionado es el primero.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };
  const plusMonth = () => {
    if (month >= nowMonth)
      return toast({
        title: 'No puedes avanzar',
        description: 'El mes seleccionado es el actual.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };
  const functions = {
    Diario: {
      plus: plusOneDay,
      minus: minusOneDay,
    },
    Mensual: {
      plus: plusMonth,
      minus: minusMonth,
    },
  };
  return (
    <Flex align='center' justify='space-between' p={1}>
      <IconButton
        aria-label='button-minus-clientes'
        icon={<ArrowLeftIcon />}
        onClick={functions[lapso as keyof typeof functions].minus}
        bg='gray.600'
        color='white'
        size='sm'
        _hover={{ opacity: 0.75 }}
        disabled={loading}
      />
      {children}

      <IconButton
        aria-label='button-plus-index'
        icon={<ArrowRightIcon />}
        onClick={functions[lapso as keyof typeof functions].plus}
        bg='gray.600'
        color='white'
        size='sm'
        _hover={{ opacity: 0.75 }}
        disabled={loading}
      />
    </Flex>
  );
};

export default ClientesDateSelector;
