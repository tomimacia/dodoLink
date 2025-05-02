import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { CajaType } from '@/types/types';

const getCajaStatus = async () => {
  const caja = (await getSingleDoc('movimientos', 'caja')) as CajaType;
  return caja ? caja?.isOpen : false;
};

export default getCajaStatus;
