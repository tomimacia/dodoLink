import GridWithFlex from '@/components/dashboard/GridFlex';
import useGetMovMonthData from '@/hooks/data/useGetMovMonthData';
import { Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import IndexGraphComp from './IndexGraphComp';

const IndexDashboard = () => {
  const [date, setDate] = useState(new Date());
  const {
    monthCompras,
    monthReservas,
    loadingMonthData,
    monthHandler,
    getMonthData,
  } = useGetMovMonthData(date.getMonth(), date.getFullYear());
  const gridData = [
    {
      title: 'Reservas',
      total: monthReservas?.length,
      aspectRatio: 2,
      entryLabel: 'Reservas/Listado',
      color: '#098f72',
    },
    {
      title: 'Compras',
      total: monthCompras?.length,
      aspectRatio: 2,
      entryLabel: 'Compras/Listado',
      color: '#b07112',
    },
  ];
  const { minusMonth, plusMonth } = monthHandler;
  const monthHandlerWithStates = {
    minusMonth: () => minusMonth(date, setDate),
    plusMonth: () => plusMonth(date, setDate),
  };
  return (
    <Flex flexGrow={1} gap={3} flexDir='column'>
      <Flex gap={4} w='100%' flexDir='column'>
        <Button
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={getMonthData}
          isLoading={loadingMonthData}
        >
          Actualizar
        </Button>

        <GridWithFlex loading={loadingMonthData} data={gridData} />
      </Flex>
      <IndexGraphComp
        date={date}
        monthReservas={monthReservas}
        monthCompras={monthCompras}
        loadingMonthData={loadingMonthData}
        monthHandlerWithStates={monthHandlerWithStates}
      />
    </Flex>
  );
};

export default IndexDashboard;
