import { CurrentURL } from '@/data/data';
import { ProductoType } from '@/types/types';

export const generateLowStockEmail = ({
  productos,
  date,
  time,
}: {
  productos: ProductoType[];
  date: string;
  time: string;
}) => {
  const productRows = productos
    .map((p) => {
      const isCritical = p.cantidad === 0;
      return `
        <tr style="${isCritical ? 'background-color: #ffe5e5;' : ''}">
          <td style="padding: 8px; border: 1px solid #ddd;">${p.nombre}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><b>${
            p.cantidad
          }</b> <i style="font-size: 0.875rem">(${p.medida})</i></td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><b>${
            p.target
          }</b></td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Notificación de Faltantes</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: rgb(143, 12, 12);
            color: white;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
          }
          .content {
            padding: 20px;
            color: #333;
          }
          .content h2 {
            color: rgb(143, 12, 12);
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #eee;
            padding: 10px;
            border: 1px solid #ccc;
            text-align: left;
          }
          .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Faltantes de Stock</h1>
          </div>
          <div class="content">
            <h2>Se han detectado productos por debajo del mínimo</h2>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time} hs</p>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
          </div>
         <a href="${CurrentURL}" style="cursor:pointer ">
          <img
            src="https://dodolink.com.ar/wp-content/uploads/2024/12/dodoLink_nuevo-logo-09.png"
            alt="Advertencia de stock"
            style="display: block; margin: 15px auto; max-width: 250px; background-color:rgb(41, 41, 41); border-radius: 5px; box-shadow: 0 0 5px"
          />
         </a>
          <div class="footer">
            Este mensaje fue generado automáticamente. No responder a este correo.
          </div>
        </div>
      </body>
    </html>
  `;
};
