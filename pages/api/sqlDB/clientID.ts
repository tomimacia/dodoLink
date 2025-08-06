import db from '@/pages/api/lib/db';
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
    // 1. Cliente
    const [ClientesFound]: [any[], any] = await db.query(
      'SELECT * FROM tblclients WHERE id = ?',
      [id]
    );
    if (ClientesFound.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    // 2. Orders
    const [orders]: [any[], any] = await db.query(
      'SELECT * FROM tblorders WHERE userid = ?',
      [id]
    );
    const orderIds = orders.map((o) => o.id);

    // 3. Hosting
    let hostings: any[] = [];
    if (orderIds.length > 0) {
      const [hostingRows]: [any[], any] = await db.query(
        `SELECT * FROM tblhosting WHERE orderid IN (${orderIds
          .map(() => '?')
          .join(',')})`,
        orderIds
      );
      hostings = hostingRows;
    }

    // 4. Productos
    const packageIdsArray = hostings.map((h) => h.packageid);
    const packageIds = packageIdsArray.filter(
      (id, index) => packageIdsArray.indexOf(id) === index
    );
    let productos: any[] = [];
    if (packageIds.length > 0) {
      const [productRows]: [any[], any] = await db.query(
        `SELECT * FROM tblproducts WHERE id IN (${packageIds
          .map(() => '?')
          .join(',')})`,
        packageIds
      );
      productos = productRows;
    }

    res.status(200).json({
      cliente: ClientesFound[0],
      orders,
      hostings,
      productos,
    });
  } catch (error) {
    console.error('Error en la API de cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
