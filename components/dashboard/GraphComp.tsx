import dateTexto from '@/helpers/dateTexto';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Flex, Heading, IconButton, Text, useToast } from '@chakra-ui/react';
import { addDays, isToday, subDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const GraphComp = ({
  data,
  date,
  loading,
  setDate,
}: {
  data: any;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  loading: boolean;
}) => {
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
  return (
    <Flex
      boxShadow='0 0 5px'
      borderRadius={10}
      p={1}
      flexDir='column'
      w='100%'
      h='350px'
    >
      <Flex align='center' p={1} justify='space-between'>
        <IconButton
          aria-label='button-minus-index'
          icon={<ArrowLeftIcon />}
          onClick={minusOneDay}
          bg='gray.700'
          color='white'
          size='sm'
          _hover={{ opacity: 0.75 }}
          disabled={loading}
        />
        <AnimatePresence mode='wait'>
          {!loading && (
            <motion.div
              key={`label-day-key-${date.getTime()}`}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <Heading as='h3' fontSize='xl'>
                {dateTexto(date.getTime() / 1000, true).textoDate}
              </Heading>
            </motion.div>
          )}
        </AnimatePresence>
        <IconButton
          aria-label='button-plus-index'
          icon={<ArrowRightIcon />}
          onClick={plusOneDay}
          bg='gray.700'
          color='white'
          size='sm'
          _hover={{ opacity: 0.75 }}
          disabled={loading}
        />
      </Flex>
      {data.length >= 0 ? (
        <>
          <Text textAlign='center'>Fichadas</Text>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis domain={[0, Math.max(20)]} />
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(label) => `${label}:00 hs`}
              />

              <Area
                type='monotone'
                dataKey='Inhabilitado'
                stackId='1'
                stroke='#E53E3E'
                fill='#E53E3E'
              />
              <Area
                type='monotone'
                dataKey='Vencido'
                stackId='1'
                stroke='#b07112'
                fill='#b07112'
              />
              <Area
                type='monotone'
                dataKey='Habilitado'
                stackId='1'
                stroke='#37A168'
                fill='#37A168'
              />
            </AreaChart>
          </ResponsiveContainer>
          <Text textAlign='center'>Horario</Text>
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

export default GraphComp;
