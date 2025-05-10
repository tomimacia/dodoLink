import dateTexto from '@/helpers/dateTexto';
import { generateLowStockEmail } from '@/alerts/nodemailer/generateEmails';
import { ProductoType } from '@/types/types';
const productosPrueba: ProductoType[] = [
  {
    nombre: 'Router Cisco 2901',
    cantidad: 2,
    id: 'dc-prod-001',
    medida: 'Un.',
    codigo: [1001, 2001],
    empresa: 'DataCore Solutions',
    cantidadPorPack: 1,
    target: 3,
    queryArr: [],
  },
  {
    nombre: 'Switch HP ProCurve 24p',
    cantidad: 5,
    id: 'dc-prod-002',
    medida: 'Un.',
    codigo: [1002, 2002],
    empresa: 'DataCore Solutions',
    cantidadPorPack: 1,
    target: 6,
    queryArr: [],
  },
  {
    nombre: 'Cable de Fibra Óptica LC-LC 10m',
    cantidad: 30,
    id: 'dc-prod-003',
    medida: 'Un.',
    codigo: [1003, 2003],
    empresa: 'DataCore Solutions',
    cantidadPorPack: 10,
    target: 50,
    queryArr: [],
  },
  {
    nombre: 'Fibra Óptica Monomodo LC/UPC 9/125µm',
    cantidad: 120, // cantidad actual
    id: 'dc-prod-005',
    medida: 'Mt.',
    codigo: [1005, 2005],
    empresa: 'DataCore Solutions',
    cantidadPorPack: 100,
    target: 200, // stock mínimo requerido
    queryArr: [],
  },
];

const Test = () => {
  const html = generateLowStockEmail({
    productos: productosPrueba,
    date: dateTexto(new Date().getTime() / 1000).textoDate,
    time: dateTexto(new Date().getTime() / 1000).hourDate,
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Test;
