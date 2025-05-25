import { TimeData } from '@/data/data';
import { getEstado } from '@/helpers/cobros/getEstado';
import { formatSecondsToHHMMSS } from '@/helpers/formatSecondsToHHMMSS';
import useGetMovMonthData from '@/hooks/data/useGetMovMonthData';
import { Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import DuracionesChart from '../DuracionesChart';
import StatsData from '../StatsData';
import TitleWithArrowsHandler from '../TitleWithArrowsHandler';

const ComprasDashboard = () => {
  const [date, setDate] = useState(new Date());
  const { monthCompras, loadingMonthData, monthHandler, getMonthData } =
    useGetMovMonthData(date.getMonth(), date.getFullYear());
  const duracionesRelevantes = monthCompras
    .filter((r) => r.movimientos.Finalizado?.fecha)
    .map((r) => {
      const estadoFinal = getEstado(r.movimientos);
      const inicial = r.movimientos.Inicializado.fecha.seconds;
      const final = r?.movimientos[estadoFinal].fecha?.seconds as number;
      return final - inicial;
    })
    .filter((d) => d > 500);

  const promedioSegundos =
    duracionesRelevantes.reduce((acc, val) => acc + val, 0) /
    duracionesRelevantes.length;
  const colores = {
    reservas: '#098f72',
    retiros: '#2269F3',
    duracion: '#F97316',
  };
  const { minusMonth, plusMonth } = monthHandler;
  const resservasStatsData = [
    {
      label: 'Total Compras',
      value: monthCompras.length,
      color: colores.reservas,
    },
    {
      label: 'Duración Promedio',
      value: `${formatSecondsToHHMMSS(promedioSegundos)} hs`,
      color: colores.duracion,
    },
  ];
  const barData = [...duracionesRelevantes]
    .sort((a, b) => b - a)
    .slice(0, 20)
    .map((dur, i) => ({
      name: `#${i + 1}`,
      duracion: Number((dur / 60).toFixed(1)), // minutos
    }));

  return (
    <Flex gap={4} flexDir='column'>
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

      <StatsData data={resservasStatsData} />
      <TitleWithArrowsHandler
        loading={loadingMonthData}
        goPrev={() => minusMonth(date, setDate)}
        goNext={() => plusMonth(date, setDate)}
        title={`${TimeData.meses[date.getMonth()]} - ${date.getFullYear()}`}
      />
      <Flex flexWrap='wrap' gap={3}>
        <DuracionesChart
          max={40}
          barData={barData}
          colorDuracion={colores.duracion}
          loading={loadingMonthData}
        />
      </Flex>
    </Flex>
  );
};

export default ComprasDashboard;
