'use client'; // Si estás usando App Router en Next.js

import { Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactLoading from 'react-loading';

type MapEmbedType = {
  initialShow?: boolean;
  hideButtons?: boolean;
  src: string;
  clean?: () => void;
};
const MapEmbed = ({
  hideButtons = false,
  src,
  clean,
  initialShow,
}: MapEmbedType) => {
  const [showMap, setShowMap] = useState(initialShow);

  const cleanFunc = () => {
    clean && clean();
    setShowMap(true);
  };
  if (!src) return <p>No se especificó ubicación.</p>;

  return (
    <Flex flexDir='column' width='100%' h={showMap ? '100%' : undefined}>
      {!hideButtons && (
        <Flex gap={2}>
          <Button
            w='fit-content'
            size='xs'
            bg='transparent'
            _hover={{ opacity: 0.8, textDecor: 'underline' }}
            onClick={() => setShowMap((prev) => !prev)}
          >
            {showMap ? 'Ocultar' : 'Mostrar'} Mapa
          </Button>
          <Button
            w='fit-content'
            size='xs'
            bg='transparent'
            _hover={{ opacity: 0.8, textDecor: 'underline' }}
            onClick={cleanFunc}
          >
            Borrar Mapa
          </Button>
        </Flex>
      )}
      {showMap && (
        <Flex minH='300px' w='100%' h='100%' pos='relative'>
          <Flex
            justify='center'
            align='center'
            pos='absolute'
            bg='gray.50'
            borderRadius='8px'
            h='100%'
            w='100%'
          >
            <ReactLoading width='10%' type='spinningBubbles' color='#333c87' />
          </Flex>
          <iframe
            width='100%'
            height='100%'
            style={{
              border: 0,
              zIndex: 1,
              borderRadius: '8px',
              minHeight: '300px',
            }}
            title='Google Map'
            loading='lazy'
            allowFullScreen
            referrerPolicy='no-referrer-when-downgrade'
            src={src || ''}
          ></iframe>
        </Flex>
      )}
    </Flex>
  );
};

export default MapEmbed;
