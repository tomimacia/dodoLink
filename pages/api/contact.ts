import { generateLowStockEmail } from '@/nodemailer/generateEmails';
import { mailOptions, transporter } from '@/nodemailer/nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productName, currentQuantity, targetQuantity, date, time } = req.body;

  if (
    !productName ||
    currentQuantity == null ||
    targetQuantity == null ||
    !date
  ) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `⚠️ Faltante de producto: ${productName}`,
      text: `Faltante detectado para ${productName}. Cantidad actual: ${currentQuantity}, target: ${targetQuantity}, fecha: ${date}`,
      html: generateLowStockEmail({
        productName,
        currentQuantity,
        targetQuantity,
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
