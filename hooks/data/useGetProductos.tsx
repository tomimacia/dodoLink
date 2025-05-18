import { getCollection } from '@/firebase/services/getCollection';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import { ProductoType } from '@/types/types';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../storageHooks/useLocalStorage';

const useGetProductos = () => {
  const [productos, setProductos] = useLocalStorage<ProductoType[] | null>(
    'PRODUCTOS_SESSION_STORAGE',
    null
  );
  const [lastUpdateProductos, setLastUpdate] = useLocalStorage<number | null>(
    'PRODUCTOS_LASTUPDATE_SECONDS_SESSION_STORAGE',
    null
  );
  const hasFetched = useRef(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const getProductos = async () => {
    console.log('Getting products');
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
    try {
      const metadata = await getSingleDoc('productos', 'metadata');
      const lastUpdateFirestore = (metadata as any)?.lastUpdate?.seconds;
      if (!lastUpdateProductos || lastUpdateProductos < lastUpdateFirestore) {
        // console.log('Datos desactualizados, obteniendo productos...');
        getProductos();
        setLastUpdate(lastUpdateFirestore);
      } else {
        console.log('Products already updated');
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
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (productos === null) {
      getProductos();
    } else {
      checkForUpdates();
    }
  }, [productos, lastUpdateProductos]);
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
