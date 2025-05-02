import { useClientsGraph } from '@/context/useClientsGraphContext';
import { TimeData } from '@/data/data';
import { getTotalFichadas } from '@/helpers/dashboard/dashboardFunctions';
import dateTexto from '@/helpers/dateTexto';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Heading,
  Icon,
  Switch,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ClientesDateSelector from './ClientesDateSelector';

const ClientsGraphComp = () => {
  const { data, date, lapso, month, loading, diario, setDiario } =
    useClientsGraph();
  const hasData = useMemo(() => {
    return data.some((d: any) => {
      const { Habilitado, Vencido, Inhabilitado, Total } = d;
      return [Habilitado, Vencido, Inhabilitado, Total].some((v) => v > 0);
    });
  }, [data]);
  const { total, diasConMovimiento, maximo } = getTotalFichadas(data);
  const Max = {
    Diario: 20,
    Mensual: diario ? 120 : Math.max(maximo, 100),
  };
  const mediaPorParam =
    diasConMovimiento > 0 ? (total / diasConMovimiento).toFixed(2) : 0;
  const customBlue = useColorModeValue('#2A3072', '#02A9EA');
  const customOrange = useColorModeValue('#821f0d', '#E53E3E');
  const mediaData = mediaPorParam as number;
  return (
    <Flex
      boxShadow='0 0 5px'
      borderRadius={10}
      p={1}
      flexDir='column'
      w='100%'
      h={['400px', '400px', '400px', '400px', '100%']}
    >
      <ClientesDateSelector>
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
      </ClientesDateSelector>

      {hasData ? (
        <>
          <Flex justify='space-evenly'>
            <Text textAlign='center'>
              Fichadas: <b>{total}</b>
            </Text>
            <Text textAlign='center'>
              Promedio x/{diario && lapso === 'Mensual' ? 'Día' : 'Hora'}:{' '}
              <b>{Math.round(mediaData)}</b>
            </Text>
          </Flex>

          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 15,
                right: 15,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis domain={[0, Max[lapso as keyof typeof Max]]} />
              <Tooltip
                labelFormatter={(label, payload) => {
                  const totalCol = payload.reduce(
                    (acc: any, item) => acc + (item.value || 0),
                    0
                  );
                  const media = (100 / (mediaPorParam as any)) * totalCol - 100;
                  if (diario && (!payload || payload.length === 0))
                    return `Día: ${label}`;

                  return (
                    <Flex flexDir='column'>
                      {!diario || lapso === 'Diario' ? (
                        <Text as='b'>{label}:00 h</Text>
                      ) : (
                        <>
                          <Text as='b'>
                            {label}/{month}
                          </Text>
                          <Divider borderColor='gray' />
                          <Text as='b' fontSize='xl'>
                            Total: {totalCol}
                          </Text>
                        </>
                      )}

                      <Flex
                        color={
                          totalCol === 0
                            ? undefined
                            : media < 0
                            ? 'red'
                            : 'green'
                        }
                        gap={1}
                        align='center'
                        fontSize='sm'
                      >
                        <Text fontStyle='italic'>
                          ({totalCol > 0 ? media.toFixed(1) : 0}%)
                        </Text>
                        {totalCol > 0 && (
                          <Icon as={media < 0 ? ArrowDownIcon : ArrowUpIcon} />
                        )}
                      </Flex>
                    </Flex>
                  );
                }}
              />

              {/* <Legend /> */}
              {diario ? (
                <>
                  <Bar dataKey='Habilitado' stackId='a' fill='#37A168' />
                  <Bar dataKey='Vencido' stackId='a' fill='#b07112' />
                  <Bar dataKey='Inhabilitado' stackId='a' fill='#E53E3E' />
                </>
              ) : (
                <Bar dataKey='Total' stackId='a'>
                  {data.map((entry: any, index: number) => {
                    const { Total } = entry;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={Total === maximo ? customOrange : customBlue}
                      />
                    );
                  })}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
          {lapso === 'Mensual' && (
            <Flex justify='center' gap={1} align='center'>
              <Text>Hora</Text>
              <Switch
                isChecked={diario}
                onChange={() => setDiario((prev) => !prev)}
              />
              <Text>Dia</Text>
            </Flex>
          )}
          {lapso === 'Diario' && <Text textAlign='center'>Hora</Text>}
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

export default ClientsGraphComp;
