import { NextApiRequest, NextApiResponse } from 'next';
import dateTexto from '@/helpers/dateTexto';
import { ProductoType } from '@/types/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método no permitido');

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_API_KEY!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Lista de productos faltantes requerida' });
  }

  // 🧠 Armar el mensaje de alerta
  const date = dateTexto(Date.now() / 1000);
  let message = `<b>🚨 Productos Faltantes</b>\n<i>Fecha: ${date.numDate}</i>\n<i>Hora: ${date.hourDate}</i>\n\n`;

  products.forEach((product: ProductoType) => {
    const isCritico = product.cantidad < product.target / 2;
    const prefijo = isCritico ? '🔴 ' : '';
    const sufijo = isCritico ? ' <b>[CRÍTICO]</b>' : '';

    message += `${prefijo}<b>${product.nombre}</b>${sufijo}\n`;
    if (product.packs && product.packs.length > 0) {
      message += `📦 Packs: <b>${product.packs.join(', ')}</b>\n`;
    }
    message += `Cantidad: <i>${product.cantidad}</i>\n`;
    message += `Target: <i>${product.target}</i>\n\n`;
  });

  // 🔐 Enviar a Telegram
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const telegramRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramRes.ok) {
      const errorText = await telegramRes.text();
      console.error('Telegram API error:', errorText);
      return res.status(500).json({ error: 'Error al enviar a Telegram' });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error general al enviar Telegram:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
