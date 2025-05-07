import { generateLowStockEmail } from '@/alerts/nodemailer/generateEmails';
import { mailOptions, transporter } from '@/alerts/nodemailer/nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productos, date, time } = req.body;

  if (!productos.length || !date) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `⚠️ Faltante de productos`,
      text: `Faltante detectado para ${productos.length} ${
        productos.length === 1 ? 'producto' : 'productos'
      }. Fecha: ${date}`,
      html: generateLowStockEmail({
        productos,
        date,
        time,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    console.error(e);
    return res
      .status(500)
      .json({ message: e.message || 'Error al enviar el correo' });
  }
};

export default handler;
