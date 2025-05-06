import { sendTelegramMessage } from '@/nodemailer/telegram';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { message } = req.body; // Extraemos el mensaje del cuerpo de la solicitud

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es obligatorio' });
    }

    await sendTelegramMessage(message); // Enviamos el mensaje a Telegram
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
}
