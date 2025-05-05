'use client'; // Si estás usando App Router en Next.js

import { Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';

const MapEmbed = ({ hideButton = false, lat, lng, src, zoom = 15 }: any) => {
  const [showMap, setShowMap] = useState(true);
  function extractSrcFromIframe(iframe: string) {
    // Extraemos el src del iframe
    const srcMatch = iframe.match(/src="([^"]+)"/);

    if (srcMatch) {
      const src = srcMatch[1];
      return src; // Devuelve solo el src
    }

    // Si no se encuentra un src, retornar null
    return null;
  }
  if (!src) return <p>No se especificó ubicación.</p>;

  return (
    <Flex flexDir='column' width='100%' height={showMap ? '400px' : undefined}>
      {!hideButton && (
        <Button
          w='fit-content'
          size='xs'
          bg='transparent'
          _hover={{ opacity: 0.8, textDecor: 'underline' }}
          onClick={() => setShowMap((prev) => !prev)}
        >
          {showMap ? 'Ocultar' : 'Mostrar'} Mapa
        </Button>
      )}
      {showMap && (
        <iframe
          width='100%'
          height='100%'
          style={{ border: 0 }}
          loading='lazy'
          allowFullScreen
          referrerPolicy='no-referrer-when-downgrade'
          src={extractSrcFromIframe(src) || ''}
        ></iframe>
      )}
    </Flex>
  );
};

export default MapEmbed;
