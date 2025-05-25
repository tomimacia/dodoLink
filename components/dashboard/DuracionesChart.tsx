import { formatSecondsToHHMMSS } from '@/helpers/formatSecondsToHHMMSS';
import { Box, Text } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const generateTicks = (maxHours: number) => {
  const interval = maxHours / 8;
  const topLimit = Math.ceil(maxHours / interval) * interval;
  const ticks = [];

  for (let i = 0; i <= topLimit; i += interval) {
    ticks.push(i * 60); // en minutos
  }

  return ticks;
};

const DuracionesChart = ({
  barData,
  colorDuracion,
  loading,
  max,
}: {
  barData: any;
  colorDuracion: string;
  loading: boolean;
  max: number; // en horas
}) => {
  return (
    <Box
      w='100%'
      maxW='700px'
      p={4}
      shadow='md'
      borderRadius='xl'
      overflow='visible'
    >
      <Text mb={3} fontWeight='bold'>
        Duraciones relevantes (Top 20)
      </Text>
      {loading ? (
        <Box h={250} />
      ) : (
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis
              tickFormatter={(value) => `${(value / 60).toFixed(0)}h`}
              ticks={generateTicks(max)}
              domain={[0, max]}
            />
            <Tooltip
              formatter={(value: number) =>
                `${formatSecondsToHHMMSS(value * 60, true)} hs`
              }
              labelFormatter={(label) => `Reserva ${label}`}
            />
            <Bar
              dataKey='duracion'
              fill={colorDuracion}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default DuracionesChart;
