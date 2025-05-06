import dateTexto from '@/helpers/dateTexto';
import { ProductoType } from '@/types/types';

export async function sendTelegramMessage(message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_API_KEY!;
  const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID!; // ID del canal o chat

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML', // opcional: permite negritas, links, etc.
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('Telegram error:', error);
    throw new Error('Error al enviar mensaje a Telegram');
  }

  return await res.json();
}

export const sendMessageTelegram = async (message: string) => {
  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }), // Enviamos el mensaje en el body
    });

    const data = await response.json();

    if (data.ok) {
      console.log('Mensaje enviado a Telegram');
    } else {
      console.log('Error al enviar mensaje');
    }
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error);
  }
};
export function parseProductosFaltantes(products: ProductoType[]): string {
  const date = dateTexto(new Date().getTime() / 1000);
  let mensaje = `<b>🚨 Productos Faltantes</b>\n<i>Fecha: ${date.numDate}</i>\n<i>Hora: ${date.hourDate}</i>\n\n`;

  products.forEach((product) => {
    mensaje += `<b>${product.nombre}</b>\n`;
    mensaje += `Cantidad: <i>${product.cantidad}</i>\n`;
    mensaje += `Target: <i>${product.target}</i>\n\n`;
  });

  return mensaje;
}
export const sendTelegramFaltantes = async (products: ProductoType[]) => {
  const mensaje = parseProductosFaltantes(products);

  // Luego enviamos el mensaje solo si hay productos faltantes
  if (mensaje !== 'No hay productos faltantes.') {
    await sendTelegramMessage(mensaje);
  } else {
    console.log('No hay productos faltantes, no se enviará el mensaje.');
  }
};
