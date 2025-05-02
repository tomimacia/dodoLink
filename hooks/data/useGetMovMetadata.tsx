import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { MovMetadataType } from '@/types/types';
import { useEffect, useState } from 'react';

const useGetMovMetadata = () => {
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [metadata, setMetadata] = useState<MovMetadataType | null>(null);
  const updateMetadata = async () => {
    setLoadingMetadata(true);
    try {
      const newMetadata = (await getSingleDoc(
        'movimientos',
        'metadata'
      )) as MovMetadataType;
      setMetadata(newMetadata);
      return newMetadata;
    } catch (error) {
      console.error('Error getting metadata', error);
      return null;
    } finally {
      setLoadingMetadata(false);
    }
  };
  useEffect(() => {
    if (metadata) return;
    try {
      updateMetadata();
    } catch (err) {
      console.log('Error getting movimientos', err);
    }
  }, []);
  return {
    loadingMetadata,
    updateMetadata,
    metadata,
    cierresDeCaja: metadata?.cierresDeCaja,
  };
};

export default useGetMovMetadata;
