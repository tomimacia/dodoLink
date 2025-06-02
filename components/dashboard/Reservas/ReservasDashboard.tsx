import { TimeData } from '@/data/data';
import { getEstado } from '@/helpers/cobros/getEstado';
import { formatSecondsToHHMMSS } from '@/helpers/formatSecondsToHHMMSS';
import useGetMovMonthData from '@/hooks/data/useGetMovMonthData';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import DuracionesChart from '../DuracionesChart';
import StatsData from '../StatsData';
import TitleWithArrowsHandler from '../TitleWithArrowsHandler';
import ReservasPieChart from './Charts/ReservasPieChart';
import { ProductoType } from '@/types/types';
import TreeMapProductos from './Charts/TreeMapChart';

const ReservasDashboard = () => {
  const [date, setDate] = useState(new Date());
  const { monthReservas, loadingMonthData, getMonthData, monthHandler } =
    useGetMovMonthData(date.getMonth(), date.getFullYear());
  const { minusMonth, plusMonth } = monthHandler;
  const reservas = monthReservas.filter((r) => !r.isRetiro);
  const retiros = monthReservas.filter((r) => r.isRetiro);

  const duracionesRelevantes = reservas
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

  // const promedioMinutos = promedioSegundos / 60;

  const colores = {
    reservas: '#098f72',
    retiros: '#2269F3',
    duracion: '#F97316',
  };

  const barData = [...duracionesRelevantes]
    .sort((a, b) => b - a)
    .slice(0, 20)
    .map((dur, i) => ({
      name: `#${i + 1}`,
      duracion: Number((dur / 60).toFixed(1)), // minutos
    }));

  const pieData = [
    { name: 'Reservas', value: reservas.length },
    { name: 'Retiros', value: retiros.length },
  ];
  const reservasStatsData = [
    {
      label: 'Total Reservas',
      value: reservas.length,
      color: colores.reservas,
    },
    {
      label: 'Total Retiros',
      value: retiros.length,
      color: colores.retiros,
    },
    {
      label: 'Duración Promedio',
      value: isNaN(promedioSegundos)
        ? 'Sin datos'
        : `${formatSecondsToHHMMSS(promedioSegundos)} hs`,
      color: colores.duracion,
    },
  ];
  const reservasConTramo = reservas.filter((r) => r.tramo && r.tramo > 100);
  const allItems = reservas.flatMap((r) => r.items);
  const reducedItems = allItems.reduce((items: ProductoType[], it) => {
    const exists = items.some((item) => item.id === it.id);
    if (!exists) {
      items.push(it);
    } else
      return items.map((i) =>
        i.id === it.id
          ? { ...i, unidades: (it?.unidades || 0) + (i.unidades || 0) }
          : i
      );
    return items;
  }, []);
  return (
    <Flex direction='column' gap={4}>
      <Button
        size='sm'
        bg='gray.700'
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.8 }}
        onClick={getMonthData}
        isLoading={loadingMonthData}
      >
        Actualizar
      </Button>
      <StatsData data={reservasStatsData} />
      <TitleWithArrowsHandler
        loading={loadingMonthData}
        goPrev={() => minusMonth(date, setDate)}
        goNext={() => plusMonth(date, setDate)}
        title={`${TimeData.meses[date.getMonth()]} - ${date.getFullYear()}`}
      />
      <Flex
        w='100%'
        flexDir={['column', 'column', 'column', 'row', 'row']}
        gap={3}
      >
        <DuracionesChart
          max={200}
          barData={barData}
          colorDuracion={colores.duracion}
          loading={loadingMonthData}
        />

        <ReservasPieChart
          loading={loadingMonthData}
          pieData={pieData}
          colores={colores}
        />
      </Flex>
      <TreeMapProductos productos={reducedItems} />
    </Flex>
  );
};

export default ReservasDashboard;
