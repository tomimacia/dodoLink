import dateTexto from '@/helpers/dateTexto';
import useGetMovimientos from '@/hooks/data/useGetMovimientos';
import { MovimientosType } from '@/types/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type MovimientosContextType = {
  movimientos: MovimientosType | null;
  loadingMovimientos: boolean;
  getMovimientos: () => void;
  deleteIngreso: (day: string, seconds: number) => Promise<void>;
  deleteEgreso: (day: string, seconds: number) => Promise<void>;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

const MovimientosContext = createContext<MovimientosContextType | undefined>(
  undefined
);

export const MovimientosProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const today = new Date();
  const day = dateTexto(today.getTime() / 1000).slashDate;
  const [selectedDate, setSelectedDate] = useState(day);
  const { loadingMovimientos, getMovimientos, movimientos } =
    useGetMovimientos(selectedDate);

  // const deleteIngreso = async (dia: string, seconds: number) => {
  //   const movimientoFetched = (await getSingleDoc(
  //     'movimientos',
  //     dia
  //   )) as MovimientosType;
  //   // Check new ingresos para eliminar el seleccionado
  //   const newIngresos = movimientoFetched.ingresos.filter(
  //     (i) => i?.fecha?.seconds !== seconds
  //   );

  //   const { items, tipoDePago, pagoParcial, total, cliente } =
  //     movimientoFetched.ingresos.find((i) => i?.fecha?.seconds === seconds) ??
  //     {};
  //   if (
  //     items?.some(
  //       (i) =>
  //         i.codigo.some(
  //           (c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT
  //         ) && i.nombre.endsWith('-ALTA')
  //     )
  //   ) {
  //     const newClientes = clientes.filter((c) => c.id !== cliente?.id);
  //     setClientes(newClientes);
  //     const shortProms = [
  //       deleteSingleDoc('clientes', cliente?.id || ''),
  //       setSingleDoc('movimientos', dia, {
  //         ingresos: newIngresos,
  //       }),
  //     ];
  //     await Promise.all(shortProms);
  //     getMovimientos();
  //     return;
  //   }
  //   const finalPromises = [];
  //   const clienteUpdated = (await getSingleDoc(
  //     'clientes',
  //     cliente?.id || ''
  //   )) as ClientType;
  //   //Check si esta ctacte y desconectar precio
  //   const ctaItem = items?.find((i) =>
  //     i.codigo.some((c) => c === ProductosCargados.ctacte.codigo[0])
  //   );
  //   if (cliente) {
  //     const updateData: Record<string, any> = {};

  //     if (ctaItem) {
  //       updateData.saldo =
  //         (updateData.saldo ?? clienteUpdated.saldo) - ctaItem.precio;
  //     }

  //     if (pagoParcial && total !== undefined) {
  //       const neto = total - pagoParcial;
  //       updateData.saldo = (updateData.saldo ?? clienteUpdated.saldo) + neto;
  //     }
  //     const contieneCuota = items?.some((i) =>
  //       i.codigo.some((c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT)
  //     );

  //     if (contieneCuota) {
  //       // Restaurar datos previos
  //       updateData.vencimiento = cliente.vencimiento;
  //       updateData.ingresoVencido = cliente.ingresoVencido;

  //       // Verificar si el cliente debería volver a estar inactivo
  //       const vencimientoDate = new Date(cliente.vencimiento.seconds * 1000);
  //       const vencimientoGracia = addMonths(vencimientoDate, 1);
  //       const ahora = new Date();

  //       if (isAfter(ahora, vencimientoGracia) && cliente.activo !== false) {
  //         updateData.activo = false;
  //       }
  //     }

  //     // Solo hacer la actualización si hay cambios
  //     if (Object.keys(updateData).length > 0) {
  //       finalPromises.push(setSingleDoc('clientes', cliente.id, updateData));
  //     }
  //   }
  //   const findProductos = items?.map((p) => getSingleDoc('productos', p.id));
  //   const productosUpd = await Promise.all(findProductos as any);
  //   const filtered = productosUpd.filter((i) => i);
  //   const resultProductos = filtered?.map((p) => {
  //     const itemEncontrado = items?.find((it) => it.id === p.id);
  //     return {
  //       ...p,
  //       cantidad: itemEncontrado?.acumulable
  //         ? p.cantidad + (itemEncontrado?.unidades as number)
  //         : 100,
  //     };
  //   });
  //   const newProductos = productos?.map((p) => {
  //     const itemEncontrado = resultProductos?.find((it) => it.id === p.id);
  //     if (itemEncontrado) return itemEncontrado;
  //     return p;
  //   });
  //   if (newProductos) {
  //     setProductos(newProductos);
  //   }
  //   if (
  //     items?.some((i) =>
  //       i.codigo.some((c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT)
  //     )
  //   ) {
  //   }
  //   resultProductos?.forEach((r) =>
  //     finalPromises.push(
  //       setSingleDoc('productos', r.id, {
  //         cantidad: r.cantidad,
  //       })
  //     )
  //   );
  //   if (resultProductos.some((p) => p.acumulable)) {
  //     await updateProductosLastStamp();
  //   }
  //   finalPromises.push(
  //     setSingleDoc('movimientos', dia, {
  //       ingresos: newIngresos,
  //     })
  //   );
  //   await Promise.all(finalPromises);
  //   getMovimientos();
  // };
  // const deleteEgreso = async (dia: string, seconds: number) => {
  //   const movimientoFetched = (await getSingleDoc(
  //     'movimientos',
  //     dia
  //   )) as MovimientosType;

  //   // Filtrar el egreso eliminado
  //   const newEgresos = movimientoFetched.egresos.filter(
  //     (i) => i?.fecha?.seconds !== seconds
  //   );

  //   const finalPromises = [];

  //   // Buscar los items del egreso a eliminar
  //   const { items } =
  //     movimientoFetched.egresos.find((i) => i?.fecha?.seconds === seconds) ??
  //     {};

  //   // Obtener los documentos de cada producto involucrado en el egreso
  //   const findProductos = items?.map((p) => getSingleDoc('productos', p.id));
  //   const productosUpd = await Promise.all(findProductos as any);
  //   const filtered = productosUpd.filter((i) => i); // Filtrar productos válidos

  //   // Actualizar cantidades de productos
  //   const resultProductos = filtered?.map((p) => {
  //     const itemEncontrado = items?.find((it) => it.id === p.id);
  //     return {
  //       ...p,
  //       cantidad: itemEncontrado?.acumulable
  //         ? p.cantidad - (itemEncontrado?.unidades as number)
  //         : 0, // Ajustar si no es acumulable
  //     };
  //   });

  //   // Actualizar el estado local de productos
  //   const newProductos = productos?.map((p) => {
  //     const itemEncontrado = resultProductos?.find((it) => it.id === p.id);
  //     if (itemEncontrado) return itemEncontrado;
  //     return p;
  //   });

  //   if (newProductos) {
  //     setProductos(newProductos);
  //   }

  //   // Guardar en la base de datos cada producto actualizado
  //   resultProductos?.forEach((r) =>
  //     finalPromises.push(
  //       setSingleDoc('productos', r.id, {
  //         cantidad: r.cantidad,
  //       })
  //     )
  //   );

  //   // Si hay productos acumulables, actualizar la última modificación
  //   if (resultProductos.some((p) => p.acumulable)) {
  //     await updateProductosLastStamp();
  //   }

  //   // Guardar el movimiento actualizado sin el egreso eliminado
  //   finalPromises.push(
  //     setSingleDoc('movimientos', dia, {
  //       egresos: newEgresos,
  //     })
  //   );

  //   // Ejecutar todas las actualizaciones en paralelo
  //   await Promise.all(finalPromises);
  //   getMovimientos();
  // };
  const deleteIngreso = async () => {};
  const deleteEgreso = async () => {};
  return (
    <MovimientosContext.Provider
      value={{
        movimientos,
        loadingMovimientos,
        getMovimientos,
        deleteIngreso,
        deleteEgreso,
        setSelectedDate,
      }}
    >
      {children}
    </MovimientosContext.Provider>
  );
};

export const useMovimientos = (): MovimientosContextType => {
  const context = useContext(MovimientosContext);
  if (!context) {
    throw new Error('useMovimientos must be used within a MovimientosProvider');
  }
  return context;
};
