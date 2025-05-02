import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { Timestamp } from 'firebase/firestore';

const updateProductosLastStamp = async () => {
  const today = Timestamp.now();
  await setSingleDoc('productos', 'metadata', { lastUpdate: today });
  window.sessionStorage.setItem(
    'PRODUCTOS_LASTUPDATE_SECONDS_SESSION_STORAGE',
    JSON.stringify(today.seconds)
  );
};

export default updateProductosLastStamp;
