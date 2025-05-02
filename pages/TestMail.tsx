import dateTexto from '@/helpers/dateTexto';
import { generateLowStockEmail } from '@/nodemailer/generateEmails';

const Test = () => {
  const html = generateLowStockEmail({
    productName: 'Producto',
    currentQuantity: 5,
    targetQuantity: 10,
    date: dateTexto(new Date().getTime() / 1000).textoDate,
    time: dateTexto(new Date().getTime() / 1000).hourDate,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Test;
