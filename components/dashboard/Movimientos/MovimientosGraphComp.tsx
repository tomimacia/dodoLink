import { useMovimientosGraph } from '@/context/useMovGraphContext';
import { TimeData } from '@/data/data';
import { addDots } from '@/helpers/addDots';
import dateTexto from '@/helpers/dateTexto';
import { Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { addDays, isToday, subDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DateSelector from './DateSelector';

const MovimientosGraphComp = () => {
  const { data, date, lapso, month, loading } = useMovimientosGraph();
  const footer = {
    Diario: 'Hora',
    Mensual: 'Día',
  };
  const Max = {
    Diario: 100000,
    Mensual: 400000,
  };
  return (
    <Flex
      boxShadow='0 0 5px'
      borderRadius={10}
      p={1}
      flexDir='column'
      w='100%'
      h={['400px', '400px', '400px', '400px', '100%']}
    >
      <DateSelector>
        <AnimatePresence mode='wait'>
          {!loading && (
            <motion.div
              key={`label-month-key-${month}-${date.getTime()}`}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <Heading as='h3' fontSize='xl'>
                {lapso === 'Diario' &&
                  dateTexto(date.getTime() / 1000, true).textoDate}
                {lapso === 'Mensual' && `${TimeData.meses[month]} - 2025`}
              </Heading>
            </motion.div>
          )}
        </AnimatePresence>
      </DateSelector>

      {data.length > 0 ? (
        <>
          <Text textAlign='center'>Movimientos</Text>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis domain={[0, Max[lapso as keyof typeof Max]]} />
              <Tooltip
                labelFormatter={(label) => {
                  if (lapso === 'Diario') {
                    return `Hora: ${label}:00 h`;
                  }
                  if (lapso === 'Mensual') {
                    return `Dia ${label}`;
                  }
                }}
                formatter={(value, name) => [
                  `$${addDots(Number(value))}`,
                  name,
                ]}
              />

              <Legend />
              <Bar dataKey='Ingresos' stackId='a' fill='#37A168' />
              <Bar dataKey='Egresos' stackId='a' fill='#b07112' />
            </BarChart>
          </ResponsiveContainer>
          <Text textAlign='center'>{footer[lapso as keyof typeof footer]}</Text>
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

export default MovimientosGraphComp;
