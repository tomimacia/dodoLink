export const generateLowStockEmail = ({
  productName,
  currentQuantity,
  targetQuantity,
  date,
  time,
}: {
  productName: string;
  currentQuantity: number;
  targetQuantity: number;
  date: string;
  time: string;
}) => {
  return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Notificación de Faltante</title>
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
              background-color:rgb(143, 12, 12);
              color: white;
              padding: 10px;
              border-radius: 8px;
              text-align: center;    
              font-weight:bold;
            }
            .content {
              padding: 20px;
              color: #333;
            }
            .content h2 {
              color:rgb(143, 12, 12);
              margin-top: 0;
            }
            .content p {
              margin: 8px 0;
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
              <h1>⚠️ Faltante de Producto</h1>
            </div>
            <div class="content">
              <h2>Se ha detectado un faltante</h2>
              <p><strong>Producto:</strong> ${productName}</p>
              <p><strong>Cantidad actual:</strong> ${currentQuantity}</p>
              <p><strong>Mínimo establecido (target):</strong> ${targetQuantity}</p>
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time} hs</p>
            </div>
            <img
              class="image-dodo"
              src="https://dodolink.com.ar/wp-content/uploads/2024/12/dodoLink_nuevo-logo-09.png"
              alt="Advertencia de stock" 
               style="display: block; margin: 15px auto; max-width: 250px; background-color:rgb(41, 41, 41); border-radius: 5px; box-shadow:0 0 5px"             
            />
            <div class="footer">
              Este mensaje fue generado automáticamente. No responder a este correo.
            </div>
          </div>
        </body>
      </html>
    `;
};
