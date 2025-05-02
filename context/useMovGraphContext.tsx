import {
  getFullMonthDataMov,
  getMovimientosDia,
} from '@/helpers/dashboard/dashboardFunctions';
import dateTexto from '@/helpers/dateTexto';
import useGetDayData from '@/hooks/data/useGetDayData';
import useGetMovimientosData from '@/hooks/data/useGetMovData';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ClientsGraphContextType {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  loading: boolean;
  lapso: string;
  setLapso: Dispatch<SetStateAction<string>>;
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
  update: any;
  data: any;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
}

const MovimientosGraphContext = createContext<
  ClientsGraphContextType | undefined
>(undefined);

export const MovimientosGraphProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lapso, setLapso] = useState('Diario');
  const [month, setMonth] = useState(new Date().getMonth());
  const [order, setOrder] = useState('');
  const today = new Date();
  const [date, setDate] = useState(today);
  const { movimientosData, loadingMovimientos, getMovimientosData } =
    useGetMovimientosData(month);
  const { movimientos, loadingData, getData } = useGetDayData(
    dateTexto(date.getTime() / 1000).slashDate
  );
  const perDay = movimientosData?.map((it: any) => getMovimientosDia(it)) || [];
  const fullMonthData = useMemo(
    () => getFullMonthDataMov(perDay, month),
    [movimientosData]
  );
  const startingData = [
    { name: '07', Ingresos: 0, Egresos: 0 },
    { name: '08', Ingresos: 0, Egresos: 0 },
    { name: '09', Ingresos: 0, Egresos: 0 },
    { name: '10', Ingresos: 0, Egresos: 0 },
    { name: '11', Ingresos: 0, Egresos: 0 },
    { name: '12', Ingresos: 0, Egresos: 0 },
    { name: '13', Ingresos: 0, Egresos: 0 },
    { name: '14', Ingresos: 0, Egresos: 0 },
    { name: '15', Ingresos: 0, Egresos: 0 },
    { name: '16', Ingresos: 0, Egresos: 0 },
    { name: '17', Ingresos: 0, Egresos: 0 },
    { name: '18', Ingresos: 0, Egresos: 0 },
    { name: '19', Ingresos: 0, Egresos: 0 },
    { name: '20', Ingresos: 0, Egresos: 0 },
    { name: '21', Ingresos: 0, Egresos: 0 },
    { name: '22', Ingresos: 0, Egresos: 0 },
  ];
  const arrangedMovimientos = () => {
    const { ingresos = [], egresos = [] } = movimientos ?? {}; // Aseguramos que sean arrays

    const arrangedIngresos: Record<string, number> = ingresos.reduce(
      (acc, ing) => {
        const { pagoParcial, total } = ing;
        const hora = dateTexto(ing?.fecha?.seconds).hourDate.split(':')[0];
        const pago = typeof pagoParcial === 'number' ? pagoParcial : total;

        acc[hora] = (acc[hora] || 0) + pago; // Asegura que siempre sea un número
        return acc;
      },
      {} as Record<string, number>
    );

    const arrangedEgresos: Record<string, number> = egresos.reduce(
      (acc, ing) => {
        const { total } = ing;
        const hora = dateTexto(ing?.fecha?.seconds).hourDate.split(':')[0];

        acc[hora] = (acc[hora] || 0) + total; // Asegura que siempre sea un número
        return acc;
      },
      {} as Record<string, number>
    );

    return { arrangedIngresos, arrangedEgresos };
  };

  // Desestructura los valores con tipos ya definidos
  const { arrangedIngresos, arrangedEgresos } = arrangedMovimientos();
  // Genera dailyData con los datos corregidos
  const dailyData = startingData.map(({ name }) => ({
    name, // Horario
    Ingresos: arrangedIngresos[name] ?? 0, // Si no hay ingresos, poner 0
    Egresos: arrangedEgresos[name] ?? 0, // Si no hay egresos, poner 0
  }));

  const data = {
    Mensual: fullMonthData,
    Anual: '',
    Diario: dailyData || [],
  };
  const updateFunc = {
    Mensual: getMovimientosData,
    Diario: getData,
  };
  return (
    <MovimientosGraphContext.Provider
      value={{
        month,
        setMonth,
        date,
        setDate,
        lapso,
        setLapso,
        order,
        setOrder,
        loading: loadingMovimientos || loadingData,
        update: updateFunc[lapso as keyof typeof updateFunc],
        data: data[lapso as keyof typeof data],
      }}
    >
      {children}
    </MovimientosGraphContext.Provider>
  );
};

export const useMovimientosGraph = () => {
  const context = useContext(MovimientosGraphContext);
  if (!context) {
    throw new Error(
      'useMovimientosGraph debe usarse dentro de un MovimientosGraphProvider'
    );
  }
  return context;
};
