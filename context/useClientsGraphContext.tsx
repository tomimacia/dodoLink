import { getEstado } from '@/helpers/cobros/getEstado';
import {
  getFichadasDia,
  getFichadasPorHora,
  getFullMonthData,
} from '@/helpers/dashboard/dashboardFunctions';
import dateTexto from '@/helpers/dateTexto';
import useGetDayData from '@/hooks/data/useGetDayData';
import useGetIngresosData from '@/hooks/data/useGetIngresosData';
import { ClientType } from '@/types/types';
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
  diario: boolean;
  setDiario: Dispatch<SetStateAction<boolean>>;
  update: any;
  data: any;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
}

const ClientsGraphContext = createContext<ClientsGraphContextType | undefined>(
  undefined
);

export const ClientsGraphProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lapso, setLapso] = useState('Diario');
  const [month, setMonth] = useState(new Date().getMonth());
  const [diario, setDiario] = useState(true);
  const today = new Date();
  const [date, setDate] = useState(today);
  const { ingresosData, loadingIngresos, getIngresosData } =
    useGetIngresosData(month);
  const { ingresos, loadingData, getData } = useGetDayData(
    dateTexto(date.getTime() / 1000).slashDate
  );
  const perDay = ingresosData?.map((it: any) => getFichadasDia(it)) || [];
  const perDayHour = getFichadasPorHora(ingresosData);
  const fullMonthData = useMemo(
    () => getFullMonthData(perDay, month),
    [ingresosData]
  );
  const startingData = [
    { name: '7', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '8', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '9', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '10', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '11', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '12', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '13', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '14', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '15', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '16', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '17', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '18', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '19', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '20', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '21', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
    { name: '22', Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
  ];
  const dailyData = ingresos
    ? startingData.map((d) => {
        const { name } = d;
        const keys = Object.keys(ingresos);
        if (keys.some((k) => k === name)) {
          const reduced = ingresos[name].reduce(
            (acc: any, obj: ClientType) => {
              const estado = getEstado(obj);
              acc[estado] = acc[estado] + 1;
              return acc;
            },
            {
              Habilitado: 0,
              Inhabilitado: 0,
              Vencido: 0,
            }
          );

          return { ...d, ...reduced };
        }
        return d;
      })
    : [];
  const data = {
    Mensual: diario ? fullMonthData : perDayHour,
    Anual: '',
    Diario: dailyData,
  };
  const updateFunc = {
    Mensual: getIngresosData,
    Diario: getData,
  };
  return (
    <ClientsGraphContext.Provider
      value={{
        month,
        setMonth,
        date,
        setDate,
        lapso,
        setLapso,
        diario,
        setDiario,
        loading: loadingIngresos || loadingData,
        update: updateFunc[lapso as keyof typeof updateFunc],
        data: data[lapso as keyof typeof data],
      }}
    >
      {children}
    </ClientsGraphContext.Provider>
  );
};

export const useClientsGraph = () => {
  const context = useContext(ClientsGraphContext);
  if (!context) {
    throw new Error(
      'useClientsGraph debe usarse dentro de un ClientsGraphProvider'
    );
  }
  return context;
};
