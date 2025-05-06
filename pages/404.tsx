import NotFoundPage from '@/components/NotFoundPage';
import React from 'react';

const NotFound = () => {
  return (
    <NotFoundPage
      content='La página que buscás no existe o fue movida.'
      title='Página no encontrada'
    />
  );
};

export default NotFound;
