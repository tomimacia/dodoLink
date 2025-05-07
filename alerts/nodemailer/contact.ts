import dateTexto from '@/helpers/dateTexto';
import { ProductoType } from '@/types/types';

export const sendContactForm = async (productos: ProductoType[]) => {
  const finalData = {
    productos,
    date: dateTexto(new Date().getTime() / 1000).textoDate,
    time: dateTexto(new Date().getTime() / 1000).hourDate,
  };
  const res = await fetch('/api/mail', {
    method: 'POST',
    body: JSON.stringify(finalData),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Fallo el envío del mensaje');
  }

  return res.json();
};
