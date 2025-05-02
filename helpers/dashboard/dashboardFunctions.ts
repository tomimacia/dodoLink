import { IngresoType } from '@/types/types';
import { clientesFilteredByEstado } from '../cobros/filterByEstado';

export const getFichadasDia = (day: any) => {
  const fecha = day.id.split('-')[0];
  const values = Object.values(day)
    .flat()
    .filter((v) => typeof v === 'object') as any[];
  // const totalNoRepetidos = values.filter(
  //   (ing: any, index, arr) =>
  //     arr.findIndex((item: any) => item?.DNI === ing?.DNI) === index
  // );
  const Habilitado = clientesFilteredByEstado('Pendiente', values).length;
  const Vencido = clientesFilteredByEstado('Pendiente', values).length;
  const Inhabilitado = clientesFilteredByEstado('Pendiente', values).length;
  return {
    name: fecha,
    Habilitado,
    Vencido,
    Inhabilitado,
  };
};
export const getFichadasPorHora = (ingresos: any) => {
  return ingresos?.reduce(
    (acc: any, day: any) => {
      const keys = Object.keys(day).filter((k) => !isNaN(Number(k))); // Extrae las claves numéricas (horas)

      keys.forEach((hour) => {
        const ingresos = day[hour]; // Obtiene la lista de ingresos para la hora específica
        const index = acc.findIndex((item: any) => item.name === hour);

        if (index !== -1) {
          acc[index].Total += ingresos.length; // Suma la cantidad de ingresos
        }
      });

      return acc;
    },
    [
      { name: '7', Total: 0 },
      { name: '8', Total: 0 },
      { name: '9', Total: 0 },
      { name: '10', Total: 0 },
      { name: '11', Total: 0 },
      { name: '12', Total: 0 },
      { name: '13', Total: 0 },
      { name: '14', Total: 0 },
      { name: '15', Total: 0 },
      { name: '16', Total: 0 },
      { name: '17', Total: 0 },
      { name: '18', Total: 0 },
      { name: '19', Total: 0 },
      { name: '20', Total: 0 },
      { name: '21', Total: 0 },
      { name: '22', Total: 0 },
    ]
  );
};
export const getTotalFichadas = (data: any) => {
  return data.reduce(
    (acc: any, day: any) => {
      const { Habilitado, Vencido, Inhabilitado, Total } = day;
      const totalDia =
        (Habilitado || 0) + (Vencido || 0) + (Inhabilitado || 0) + (Total || 0);

      if (totalDia > 0) {
        acc.total += totalDia;
        acc.diasConMovimiento++;
        acc.maximo = Math.max(acc.maximo, totalDia);
      }

      return acc;
    },
    { total: 0, diasConMovimiento: 0, maximo: 0 } // Inicializamos maximo en 0
  );
};
export const getFullMonthData = (perDay: any[], month: number) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();

  const existingDays = perDay.reduce((acc, day) => {
    acc[day.name] = day;
    return acc;
  }, {} as Record<string, any>);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = (i + 1).toString();
    return (
      existingDays[dayNum] || {
        name: dayNum,
        Habilitado: 0,
        Vencido: 0,
        Inhabilitado: 0,
      }
    );
  });
};
export const getMovimientosDia = (day: any) => {
  const { ingresos, egresos, fecha } = day;
  const totalIngresos = ingresos.reduce((acc: number, ing: IngresoType) => {
    const { pagoParcial, total } = ing;
    const pago = typeof pagoParcial === 'number' ? pagoParcial : total;
    return acc + pago;
  }, 0);
  const totalEgresos = egresos.reduce((acc: number, ing: IngresoType) => {
    return acc + ing.total;
  }, 0);
  const formatedFecha = fecha.split('-')[0];
  return {
    name: formatedFecha,
    Ingresos: totalIngresos,
    Egresos: totalEgresos,
  };
};
export const getFullMonthDataMov = (perDay: any[], month: number) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();

  const existingDays = perDay.reduce((acc, day) => {
    acc[day.name] = day;
    return acc;
  }, {} as Record<string, any>);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = (i + 1).toString();
    return (
      existingDays[dayNum] || {
        name: dayNum,
        Ingresos: 0,
        Egresos: 0,
      }
    );
  });
};
