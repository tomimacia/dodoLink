import { IngresoType, TipoDePagoType } from '@/types/types';

export const filterByTipo = (
  tipoDePago: TipoDePagoType,
  arr?: IngresoType[]
) => {
  return arr?.filter((i) => i.tipoDePago === tipoDePago);
};
