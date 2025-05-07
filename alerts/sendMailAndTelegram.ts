import { ProductoType } from '@/types/types';
import { sendContactForm } from './nodemailer/contact';
import { sendTelegramFaltantes } from './telegram/contact';

export const sendMailAndTelegram = async (items: ProductoType[]) => {
  try {
    await sendContactForm(items);
    await sendTelegramFaltantes(items);
  } catch (e: any) {
    console.error(e.message);
  }
};
