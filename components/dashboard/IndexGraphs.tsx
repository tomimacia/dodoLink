import { getEstado } from '@/helpers/cobros/getEstado';
import dateTexto from '@/helpers/dateTexto';
import useGetDayData from '@/hooks/data/useGetDayData';
import { ClientType } from '@/types/types';
import { Button, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import GridWithFlex from '../movimientos/GridFlex';
import ClientesModal from './Clientes/ClientesModal';
import GraphComp from './GraphComp';

const IndexGraphs = () => {
  const [date, setDate] = useState(new Date());
  const day = dateTexto(date.getTime() / 1000).slashDate;
  const [modalData, setModalData] = useState({
    title: '',
    list: [],
  });
  const handleOpenModal = (title: string, list: any) => {
    setModalData({ title, list });
    onOpen();
  };
  const { ingresos, totalIngresos, movimientos, loadingData, getData } =
    useGetDayData(day);

  const cantidadIngresosHoy = totalIngresos.length;
  const totalIngresosHoy =
    movimientos?.ingresos.reduce((acc: any, p: any) => {
      const { pagoParcial, total } = p;
      return acc + (typeof pagoParcial === 'number' ? pagoParcial : total);
    }, 0) || 0;
  const totalEgresosHoy =
    movimientos?.egresos.reduce((acc: any, p: any) => {
      const { total } = p;
      return acc + total;
    }, 0) || 0;
  const startingData = [
    { name: '7', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '8', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '9', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '10', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '11', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '12', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '13', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '14', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '15', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '16', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '17', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '18', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '19', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '20', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '21', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '22', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
  ];
  const getFinalData = ingresos
    ? startingData.map((d) => {
        const { name } = d;
        const keys = Object.keys(ingresos);
        if (keys.some((k) => k === name)) {
          const reduced = ingresos[name].reduce(
            (acc: any, obj: ClientType) => {
              const estado = getEstado(obj);
              acc[estado] = acc[estado] + 1;
              return acc;
            },
            {
              Habilitado: 0,
              Inhabilitado: 0,
              Vencido: 0,
            }
          );

          return { ...d, ...reduced };
        }
        return d;
      })
    : [];
  const gridData = [
    {
      title: 'Ingresos',
      total: totalIngresosHoy,
      aspectRatio: 2,
      entryLabel: 'Ingresos',
      color: '#098f72',
    },
    {
      title: 'Egresos',
      total: totalEgresosHoy,
      aspectRatio: 2,
      entryLabel: 'Egresos',
      color: '#821f0d',
    },
    {
      title: 'Neto Diario',
      total: totalIngresosHoy - totalEgresosHoy,
      aspectRatio: 4,
      entryLabel: '',
      color: 'blue.800',
    },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex w='100%' my={4} gap={3} flexDir='column'>
      <Flex
        w='100%'
        gap={5}
        flexDir={['column', 'column', 'column', 'column', 'row']}
      >
        <Flex w='100%' gap={2} flexDir='column'>
          <Flex justify='space-between' align='flex-end'>
            <Button
              bg='gray.600'
              color='white'
              w='fit-content'
              size='sm'
              _hover={{ opacity: 0.65 }}
              onClick={getData}
              isLoading={loadingData}
            >
              Actualizar
            </Button>
            <Text
              cursor='pointer'
              _hover={{ textDecor: 'underline' }}
              onClick={() =>
                handleOpenModal(
                  `${dateTexto(date.getTime() / 1000, true).textoDate}`,
                  totalIngresos
                )
              }
            >
              Total: <b>{cantidadIngresosHoy}</b>
            </Text>
            <Flex w={20} />
          </Flex>
          <ClientesModal
            isOpen={isOpen}
            onClose={onClose}
            modalData={modalData}
          />
          <GraphComp
            loading={loadingData}
            date={date}
            setDate={setDate}
            data={getFinalData}
          />
        </Flex>
        <Flex minW='300px' flexDir='column'>
          <Flex my={2} justify='space-between'>
            <AnimatePresence mode='wait'>
              {!loadingData && (
                <motion.div
                  key={`label-day-key-${date.getTime()}`}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  <Heading as='h3' fontSize='xl'>
                    Ingresos y Egresos{' '}
                    {dateTexto(date.getTime() / 1000, true).numDate}
                  </Heading>
                </motion.div>
              )}
            </AnimatePresence>
            <Heading opacity={0} as='h3' fontSize='xl'>
              T
            </Heading>
          </Flex>

          <GridWithFlex data={gridData} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default IndexGraphs;
