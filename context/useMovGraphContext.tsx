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

  const data = {
    Mensual: fullMonthData,
    Anual: '',
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
