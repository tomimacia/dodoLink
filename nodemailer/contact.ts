import dateTexto from '@/helpers/dateTexto';

export const sendContactForm = async (data: {
  productName: string;
  currentQuantity: number;
  targetQuantity: number;
}) => {
  const finalData = {
    ...data,
    date: dateTexto(new Date().getTime() / 1000).textoDate,
    time: dateTexto(new Date().getTime() / 1000).hourDate,
  };
  const res = await fetch('/api/contact', {
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
