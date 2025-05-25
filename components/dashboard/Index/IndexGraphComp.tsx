import { TimeData } from '@/data/data';
import { PedidoType } from '@/types/types';
import { Flex, Text } from '@chakra-ui/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import TitleWithArrowsHandler from '../TitleWithArrowsHandler';

const IndexGraphComp = ({
  date,
  monthReservas,
  monthCompras,
  loadingMonthData,
  monthHandlerWithStates,
}: {
  date: Date;
  monthReservas: PedidoType[];
  monthCompras: PedidoType[];
  loadingMonthData: boolean;
  monthHandlerWithStates: {
    minusMonth: () => void;
    plusMonth: () => void;
  };
}) => {
  const processChartData = () => {
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const dayData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: (i + 1).toString(),
      reservas: 0,
      compras: 0,
    }));

    monthReservas?.forEach((item: PedidoType) => {
      const day = new Date(
        item.movimientos.Inicializado.fecha.seconds * 1000
      ).getDate();
      dayData[day - 1].reservas += 1;
    });

    monthCompras?.forEach((item: PedidoType) => {
      const day = new Date(
        item.movimientos.Inicializado.fecha.seconds * 1000
      ).getDate();
      dayData[day - 1].compras += 1;
    });

    return dayData;
  };
  const chartData = processChartData();
  const { minusMonth, plusMonth } = monthHandlerWithStates;
  return (
    <Flex
      boxShadow='0 0 5px'
      borderRadius={10}
      p={1}
      flexDir='column'
      w='100%'
      h='400px'
    >
      <TitleWithArrowsHandler
        loading={loadingMonthData}
        goPrev={minusMonth}
        goNext={plusMonth}
        title={`${TimeData.meses[date.getMonth()]} - ${date.getFullYear()}`}
      />
      {monthReservas.length > 0 || monthCompras.length > 0 ? (
        <>
          <Text textAlign='center'>Movimientos</Text>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id='colorReservas' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='10%' stopColor='#37A168' />
                  <stop offset='100%' stopColor='#37A168' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='colorCompras' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='10%' stopColor='#b07112' />
                  <stop offset='100%' stopColor='#b07112' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='day' />
              <YAxis />
              <CartesianGrid strokeDasharray='1 1' />
              <Tooltip labelFormatter={(label) => `Día ${label}`} />
              <Legend />
              <Area
                type='monotone'
                dataKey='reservas'
                stroke='#37A168'
                fillOpacity={1}
                fill='url(#colorReservas)'
              />
              <Area
                type='monotone'
                dataKey='compras'
                stroke='#b07112'
                fillOpacity={1}
                fill='url(#colorCompras)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Flex
          boxShadow='inset 0 0 4px'
          m={10}
          borderRadius={10}
          h='100%'
          justify='center'
          align='center'
        >
          <Text fontSize='lg' fontStyle='italic'>
            No hay datos para mostrar
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default IndexGraphComp;
