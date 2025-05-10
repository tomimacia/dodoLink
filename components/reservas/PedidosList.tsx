import dateTexto from '@/helpers/dateTexto';
import useGetMovDayData from '@/hooks/data/useGetMovDayData';
import usePagination from '@/hooks/data/usePagination';
import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { FaListUl, FaThLarge, FaThList } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';
import ReactLoading from 'react-loading';
import PaginationControl from './PaginationControl';
import PedidoCard from './PedidoCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { addDays, isToday, subDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
const PedidosList = () => {
  const [date, setDate] = useState(new Date());
  const [lapso, setLapso] = useState('Diario');
  const fecha = dateTexto(date.getTime() / 1000).slashDate;
  const { reservas, getData, loadingData } = useGetMovDayData(fecha);
  const [isList, setIsList] = useState(false);
  const [consulta, setConsulta] = useState('');
  const filterPedidos = useCallback(() => {
    if (consulta.trim().length < 2) return reservas; // Evita búsquedas con pocos caracteres

    return reservas?.filter((c) => {
      const consultaLower = consulta.toLowerCase().trim(); // Limpia espacios extras
      return (
        c.id.toLowerCase().includes(consultaLower) ||
        c.cliente.toLowerCase().includes(consultaLower)
      );
    });
  }, [consulta, reservas]);
  const filteredPedidos = filterPedidos();
  const toast = useToast();
  const resevasFinal = filteredPedidos || [];
  const itemsPerPage = 12;
  const { page, goingUp, totalPages, paginatedArr, handlePageChange } =
    usePagination(resevasFinal, itemsPerPage);
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
  const LapseOptions = ['Diario', 'Mensual'];
  return (
    <Flex gap={5} direction='column' p={4} rounded='lg' boxShadow='md'>
      <Heading size='md'>Listado de Reservas</Heading>

      {/* Controles de filtros y fecha */}
      <Flex
        gap={4}
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify='space-between'
        p={4}
        rounded='md'
        boxShadow='sm'
        border='1px solid'
        borderColor='gray.200'
      >
        <Flex gap={2} align='center' wrap='wrap'>
          <Button
            bg='gray.600'
            color='white'
            size='sm'
            _hover={{ bg: 'gray.700' }}
            onClick={getData}
            isLoading={loadingData}
          >
            Actualizar
          </Button>

          <Select
            size='sm'
            borderRadius='md'
            borderColor='gray.300'
            value={lapso}
            onChange={(e) => setLapso(e.target.value)}
            w='fit-content'
          >
            {LapseOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>

          {lapso === 'Diario' && (
            <Menu isLazy>
              <MenuButton
                as={Button}
                size='sm'
                bg='gray.700'
                color='white'
                _hover={{ bg: 'gray.800' }}
              >
                Elegir Fecha
              </MenuButton>
              <MenuList p={3} boxShadow='lg'>
                <DayPicker
                  mode='single'
                  required
                  selected={date}
                  onSelect={setDate} // Maneja el estado
                  captionLayout='dropdown'
                  disabled={{
                    before: new Date('2025-05-08'),
                    after: new Date(),
                  }}
                />
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Flex gap={3} align='center'>
          <Icon
            fontSize='22px'
            cursor='pointer'
            as={isList ? FaTableCellsLarge : FaThLarge}
            color={isList ? 'gray.400' : 'gray.700'}
             _dark={{ color: isList ? 'gray.400' : 'gray.200' }}
            onClick={() => setIsList(false)}
          />
          <Icon
            fontSize='22px'
            cursor='pointer'
            as={isList ? FaThList : FaListUl}
            color={isList ? 'gray.700' : 'gray.400'}
            _dark={{ color: isList ? 'gray.200' : 'gray.400' }}
            onClick={() => setIsList(true)}
          />
          <Input
            size='sm'
            maxW='200px'
            placeholder='Filtrar pedidos'
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            borderColor='gray.300'
            _focus={{ borderColor: 'gray.500', boxShadow: 'sm' }}
          />
        </Flex>
      </Flex>

      {/* Encabezado con flechas */}
      <Flex align='center' justify='space-between' py={2}>
        <IconButton
          aria-label='Retroceder día'
          icon={<ArrowLeftIcon />}
          onClick={minusOneDay}
          size='sm'
          bg='gray.700'
          color='white'
          _hover={{ bg: 'gray.800' }}
          disabled={loadingData}
        />
        <AnimatePresence mode='wait'>
          {!loadingData && (
            <motion.div
              key={`label-day-${date.getTime()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Heading as='h3' size='md' color='gray.700'>
                {dateTexto(date.getTime() / 1000, true).textoDate}
              </Heading>
            </motion.div>
          )}
        </AnimatePresence>
        <IconButton
          aria-label='Avanzar día'
          icon={<ArrowRightIcon />}
          onClick={plusOneDay}
          size='sm'
          bg='gray.700'
          color='white'
          _hover={{ bg: 'gray.800' }}
          disabled={loadingData}
        />
      </Flex>
      {loadingData ? (
        <Flex justify='center' w='full' py={6}>
          <ReactLoading type='bars' color='#333c87' />
        </Flex>
      ) : (
        <Flex direction='column' gap={6}>
          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={resevasFinal.length > itemsPerPage}
          />

          <AnimatePresence mode='wait'>
            <motion.div
              key={`content-${page}-${isList ? 'list' : 'grid'}`}
              style={{
                display: 'flex',
                flexDirection: isList ? 'column' : undefined,
                flexWrap: isList ? undefined : 'wrap',
                gap: 12,
                padding: 8,
                marginTop: 8,
              }}
              initial={{ opacity: 0, x: goingUp ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: goingUp ? -15 : 15 }}
            >
              {paginatedArr.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  isList={isList}
                  deleteClienteFront={() => {}}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={resevasFinal.length > itemsPerPage}
          />
        </Flex>
      )}

      {!loadingData && resevasFinal.length === 0 && (
        <Text align='center' py={4}>
          No se encontraron resultados.
        </Text>
      )}
    </Flex>
  );
};

export default PedidosList;
