import { getCollection } from '@/firebase/services/getCollection';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import { ProductoType } from '@/types/types';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetProductos = () => {
  const [productos, setProductos] = useSessionStorage<ProductoType[] | null>(
    'PRODUCTOS_SESSION_STORAGE',
    null
  );
  const [lastUpdateProductos, setLastUpdate] = useSessionStorage<number | null>(
    'PRODUCTOS_LASTUPDATE_SECONDS_SESSION_STORAGE',
    null
  );
  const [loadingProductos, setLoadingProductos] = useState(false);
  const getProductos = async () => {
    console.log('Getting productos');
    setLoadingProductos(true);
    try {
      const productsFetched = await getCollection('productos');
      const withoutMetadata = productsFetched.filter(
        (p) => p.id !== 'metadata'
      );
      const now = Timestamp.now();
      setLastUpdate(now.seconds);
      setProductos(withoutMetadata as ProductoType[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingProductos(false);
    }
  };
  const checkForUpdates = async () => {
    setLoadingProductos(true);
    try {
      const metadata = await getSingleDoc('productos', 'metadata');
      const lastUpdateFirestore = (metadata as any)?.lastUpdate?.seconds;
      if (!lastUpdateProductos || lastUpdateProductos < lastUpdateFirestore) {
        // console.log('Datos desactualizados, obteniendo productos...');
        getProductos();
        setLastUpdate(lastUpdateFirestore);
      }
    } catch (err) {
      console.log('Error verificando actualización de productos', err);
    } finally {
      setLoadingProductos(false);
    }
  };
  const updateProducto = async (
    productID: string,
    newProduct: ProductoType
  ) => {
    if (!productos) return;
    const newProductos = productos?.map((p) =>
      p.id === productID ? newProduct : p
    );
    setProductos(newProductos);
    try {
      await updateProductosLastStamp();
    } catch (e) {
      console.log(e);
    }
  };
  // const availableProducts =
  //   productos?.filter((p) => p.cantidad > 0 && p.stock) || null;
  useEffect(() => {
    if (productos !== null) return;

    try {
      getProductos();
    } catch (err) {
      console.log('Error getting productos', err);
    }
  }, [productos, lastUpdateProductos, setProductos, getProductos]);
  return {
    loadingProductos,
    setProductos,
    getProductos,
    productos,
    checkForUpdates,
    updateProducto,
  };
};

export default useGetProductos;
