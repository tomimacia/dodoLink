import { sendMailAndTelegram } from '@/alerts/sendMailAndTelegram';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ProductoType } from '@/types/types';
import { arrayUnion } from 'firebase/firestore';
import dateTexto from '../dateTexto';
import updateProductosLastStamp from '../updateProductosLastStamp';

function createID(fechaHoy: string) {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `${fechaHoy.split('-').join('')}-${randomNumber}`;
}
export const ConfirmValidation = (
  detalle: string,
  cliente: string,
  itemsZero: boolean,
  toast: any
) => {
  if (!cliente || !detalle) {
    toast({
      title: 'Error',
      description: 'Debe completar los campos',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }

  if (itemsZero) {
    toast({
      title: 'Error',
      description: 'Debe agregar al menos un producto',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }

  return true;
};
export const CargarReserva = async (newMovimiento: any) => {
  console.log(newMovimiento);
  const { Inicializado } = newMovimiento?.movimientos;
  const fechaHoy = dateTexto(Inicializado.fecha.seconds).slashDate;
  const id = createID(fechaHoy);
  const finalMov = { ...newMovimiento, id };
  console.log('cargando reserva', fechaHoy, id, finalMov);
  const dayDoc = (await getSingleDoc('movimientos', fechaHoy)) as any;
  if (!dayDoc) {
    await setSingleDoc('movimientos', fechaHoy, {
      reservas: [finalMov],
      compras: [],
      fecha: fechaHoy,
    });
  } else {
    await setSingleDoc('movimientos', fechaHoy, {
      reservas: arrayUnion(finalMov),
    });
  }
  await setSingleDoc('movimientos', 'enCurso', {
    reservas: arrayUnion(finalMov),
  });
};
export const CargarCompra = async (newMovimiento: any) => {
  const { fecha } = newMovimiento;
  const fechaHoy = dateTexto(fecha.getTime() / 1000)
    .numDate.split('/')
    .join('-');
  const id = createID(fechaHoy);
  const finalMov = { ...newMovimiento, id };
  const dayDoc = (await getSingleDoc('movimientos', fechaHoy)) as any;
  if (!dayDoc) {
    await setSingleDoc('movimientos', fechaHoy, {
      compras: [finalMov],
      reservas: [],
      fecha: fechaHoy,
    });
  } else {
    await setSingleDoc('movimientos', fechaHoy, {
      compras: arrayUnion(finalMov),
    });
  }
  await setSingleDoc('movimientos', 'enCurso', {
    compras: arrayUnion(finalMov),
  });
};
export const ActualizarStock = async (
  items: ProductoType[],
  productos: ProductoType[],
  setProductos: (newProductos: ProductoType[]) => void,
  isPago: boolean
) => {
  if (items.length === 0) return;
  const promises = items.map((i) => {
    // Eliminamos 'unidades' del objeto
    const newCantidad = isPago
      ? i.cantidad + (i?.unidades || 1)
      : i.cantidad - (i?.unidades || 1);
    return setSingleDoc('productos', i.id, {
      cantidad: newCantidad,
    });
  });
  const newItems = items.map((i) => {
    const { unidades, ...noUnidades } = i;
    const newCantidad = isPago
      ? i.cantidad + (i?.unidades || 1)
      : i.cantidad - (i?.unidades || 1);
    return { ...noUnidades, cantidad: newCantidad };
  });
  const faltantes = newItems.filter((p) => p.cantidad < p.target);
  if (faltantes.length > 0) {
    sendMailAndTelegram(faltantes);
  }
  const newProductos = productos?.map((p) => {
    if (!newItems.some((i) => i.id === p.id)) return p;
    const newProducto = newItems.find((it) => it.id === p.id);
    return { ...newProducto };
  });
  setProductos(newProductos as any);
  try {
    await Promise.all(promises);

    await updateProductosLastStamp();
  } catch (e) {
    console.log(e);
  }
};
