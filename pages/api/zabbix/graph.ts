import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { graphid, from, to } = req.body;

  if (!graphid) {
    return res.status(400).json({ message: 'Falta el graphid' });
  }

  const zabbixURL = process.env.ZABBIX_URL || '';
  const username = process.env.ZABBIX_USER || '';
  const password = process.env.ZABBIX_PASSWORD || '';

  try {
    // Paso 1: Login
    const loginRes = await fetch(`${zabbixURL}index.php`, {
      method: 'POST',
      body: new URLSearchParams({
        name: username,
        password,
        enter: 'Sign in',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'manual',
    });

    const cookies = loginRes.headers.get('set-cookie');
    if (!cookies) {
      throw new Error('No se pudo obtener cookie de sesión');
    }

    // Paso 2: Formar URL con fechas si existen
    const params = new URLSearchParams({
      graphid,
      width: '800',
      height: '200',
    });

    if (from && to) {
      params.append('from', from); // Debe venir ya en formato 'YYYY-MM-DD HH:mm:ss'
      params.append('to', to);
      params.append('profileIdx', 'web.charts.filter');
      params.append('_', 'xbuibgli');
    }

    const chartUrl = `${zabbixURL}chart2.php?${params.toString()}`;

    const graphRes = await fetch(chartUrl, {
      headers: {
        Cookie: cookies,
      },
    });

    if (!graphRes.ok) {
      throw new Error(`Error al obtener el gráfico: ${graphRes.status}`);
    }

    const imageBuffer = await graphRes.arrayBuffer();

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      throw new Error('El gráfico no tiene datos válidos');
    }

    const imageBase64 = `data:image/png;base64,${Buffer.from(
      imageBuffer
    ).toString('base64')}`;

    return res.status(200).json({ imageBase64 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error Zabbix:', message);
    return res.status(500).json({ error: message });
  }
}
