import { ProductoType } from '@/types/types';

export const sendTelegramFaltantes = async (products: ProductoType[]) => {
  if (!products || products.length === 0) return;

  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Error al enviar alerta a Telegram:', data.error);
    }
  } catch (error) {
    console.error('Error de red al enviar Telegram:', error);
  }
};
