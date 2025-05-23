import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { Timestamp } from 'firebase/firestore';

const updateProductosLastStamp = async () => {
  const today = Timestamp.now();
  window.localStorage.setItem(
    'PRODUCTOS_LASTUPDATE_SECONDS_SESSION_STORAGE',
    JSON.stringify(today.seconds)
  );
  await setSingleDoc('productos', 'metadata', { lastUpdate: today });
};

export default updateProductosLastStamp;
