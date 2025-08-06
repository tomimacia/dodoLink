import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { Timestamp } from 'firebase/firestore';

export const lastUpdateServiciosKEY =
  'SERVICIOS_DB_LASTUPDATE_SECONDS_SESSION_STORAGE_DODO';
export const lastUpdateProductosKEY =
  'PRODUCTOS_LASTUPDATE_SECONDS_SESSION_STORAGE_DODO';

export const updateServiciosLastStamp = async () => {
  const today = Timestamp.now();
  window.localStorage.setItem(
    lastUpdateServiciosKEY,
    JSON.stringify(today.seconds)
  );
  await setSingleDoc('servicios', 'metadata', { lastUpdate: today });
};
export const updateProductosLastStamp = async () => {
  const today = Timestamp.now();
  window.localStorage.setItem(
    lastUpdateProductosKEY,
    JSON.stringify(today.seconds)
  );
  await setSingleDoc('productos', 'metadata', { lastUpdate: today });
};
