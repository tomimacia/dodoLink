import { getCollection } from '@/firebase/services/getCollection';
import useOnSnapshot from '@/firebase/services/useOnSnapshot';
import { ProductoType } from '@/types/types';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../storageHooks/useLocalStorage';
import {
  lastUpdateProductosKEY,
  updateProductosLastStamp,
} from '@/helpers/updateStamps';

const productosKEY = 'PRODUCTOS_SESSION_STORAGE_DODO';

const useGetProductos = (shouldUpdate: boolean = false) => {
  const [productos, setProductos] = useLocalStorage<ProductoType[] | null>(
    productosKEY,
    null
  );
  const [lastUpdateProductos, setLastUpdate] = useLocalStorage<number | null>(
    lastUpdateProductosKEY,
    null
  );
  const hasFetched = useRef(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const getProductos = async () => {
    console.log('updating productos');
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
  // const checkForUpdates = async () => {
  //   try {
  //     const metadata = await getSingleDoc('productos', 'metadata');
  //     const lastUpdateFirestore = (metadata as any)?.lastUpdate?.seconds;
  //     if (!lastUpdateProductos || lastUpdateProductos < lastUpdateFirestore) {
  //       // console.log('Datos desactualizados, obteniendo productos...');
  //       getProductos();
  //       setLastUpdate(lastUpdateFirestore);
  //     } else {
  //       console.log('Products already updated');
  //     }
  //   } catch (err) {
  //     console.log('Error verificando actualización de productos', err);
  //   } finally {
  //     setLoadingProductos(false);
  //   }
  // };
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
  const allPacks = useMemo(() => {
    return productos
      ?.reduce((acc, p) => {
        if (Array.isArray(p?.packs)) return acc.concat(p.packs);
        return acc;
      }, [] as string[])
      .filter((p, i, arr) => arr.indexOf(p) === i);
  }, [productos]);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (productos === null) {
      getProductos();
    }
    // else {
    //   checkForUpdates();
    // }
  }, [productos, lastUpdateProductos]);
  const { data: metadata, loading } = useOnSnapshot('productos', 'metadata');
  const checkUpdates = async () => {
    setTimeout(async () => {
      const lastUpdateUpdated = window.localStorage.getItem(
        lastUpdateProductosKEY
      );
      if (metadata.lastUpdate.seconds !== Number(lastUpdateUpdated)) {
        await getProductos();
        setLastUpdate(metadata.lastUpdate.seconds);
      } else {
        const newProductos = window.localStorage.getItem(productosKEY);
        if (newProductos) {
          const parsed = JSON.parse(newProductos);
          setProductos(parsed);
        }
        console.log('Products up to date');
      }
    }, 50);
  };
  useEffect(() => {
    if (!loading && metadata?.lastUpdate && shouldUpdate) {
      console.log('Cheking updates');
      checkUpdates();
    }
  }, [metadata]);
  return {
    loadingProductos,
    setProductos,
    getProductos,
    checkUpdates,
    productos,
    updateProducto,
    allPacks,
  };
};

export default useGetProductos;
