import db from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    // 1. Producto
    const [productos]: [any[], any] = await db.query(
      'SELECT * FROM tblproducts WHERE id = ?',
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // 2. Hostings relacionados con ese producto
    const [hostings]: [any[], any] = await db.query(
      'SELECT * FROM tblhosting WHERE packageid = ?',
      [id]
    );

    // 3. Órdenes relacionadas a esos hostings
    let orders: any[] = [];
    if (hostings.length > 0) {
      const orderIds = hostings.map((h) => h.orderid);
      const [orderRows]: [any[], any] = await db.query(
        `SELECT * FROM tblorders WHERE id IN (${orderIds
          .map(() => '?')
          .join(',')})`,
        orderIds
      );
      orders = orderRows;
    }

    res.status(200).json({
      producto: productos[0],
      hostings,
      orders,
    });
  } catch (error) {
    console.error('Error en la API de producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
