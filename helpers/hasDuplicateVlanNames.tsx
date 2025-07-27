import { VLANType } from '@/types/types';

export const hasDuplicateVlanNames = (vlans: VLANType[]) => {
  const nombres = vlans.map((v) => v.nombre?.trim()).filter(Boolean);
  return nombres.some((n, i) => nombres.indexOf(n) !== i);
};
