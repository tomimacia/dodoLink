import { codigos, ProductosCargados } from '@/data/data';
import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import dateTexto from '@/helpers/dateTexto';
import { filterByTipo } from '@/helpers/movimientos/filterByTipo';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import useGetMovimientos from '@/hooks/data/useGetMovimientos';
import useGetProductos from '@/hooks/data/useGetProductos';
import useGetClientes from '@/hooks/useGetClientes';
import {
  CajaType,
  ClientType,
  IngresoType,
  TotalCajaType,
  MontoInicialCajaType,
  MovimientosDataType,
  MovimientosType,
} from '@/types/types';
import { addMonths, isAfter } from 'date-fns';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type MovimientosContextType = {
  movimientos: MovimientosType | null;
  egresos: IngresoType[] | undefined;
  loadingMovimientos: boolean;
  loadingCaja: boolean;
  getMovimientos: () => void;
  ingresos: IngresoType[] | undefined;
  deleteIngreso: (day: string, seconds: number) => Promise<void>;
  EgresosData: MovimientosDataType;
  IngresosData: MovimientosDataType;
  deleteEgreso: (day: string, seconds: number) => Promise<void>;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  caja: CajaType | null;
  abrirCaja: (monto: MontoInicialCajaType) => Promise<void>;
  cerrarCaja: (montoFinal: TotalCajaType) => Promise<void>;
  CajaTotal: TotalCajaType;
  TotalCtaCte: number | undefined;
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
  const { setClientes, clientes } = useGetClientes();
  const day = dateTexto(today.getTime() / 1000).slashDate;
  const [selectedDate, setSelectedDate] = useState(day);
  const { setProductos, productos } = useGetProductos();
  const {
    loadingMovimientos,
    caja,
    cerrarCaja,
    abrirCaja,
    getMovimientos,
    movimientos,
    loadingCaja,
  } = useGetMovimientos(selectedDate);

  const { ingresos, egresos } = movimientos ?? {};
  const PagosCtaCorriente = ingresos?.filter(
    (i) => typeof i.pagoParcial === 'number'
  );
  const TotalCtaCte = PagosCtaCorriente?.reduce((acc, p) => {
    return (acc = acc + (p as any)?.pagoParcial - p.total);
  }, 0);

  const deleteIngreso = async (dia: string, seconds: number) => {
    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      dia
    )) as MovimientosType;
    // Check new ingresos para eliminar el seleccionado
    const newIngresos = movimientoFetched.ingresos.filter(
      (i) => i?.fecha?.seconds !== seconds
    );

    const { items, tipoDePago, pagoParcial, total, cliente } =
      movimientoFetched.ingresos.find((i) => i?.fecha?.seconds === seconds) ??
      {};
    if (
      items?.some(
        (i) =>
          i.codigo.some(
            (c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT
          ) && i.nombre.endsWith('-ALTA')
      )
    ) {
      const newClientes = clientes.filter((c) => c.id !== cliente?.id);
      setClientes(newClientes);
      const shortProms = [
        deleteSingleDoc('clientes', cliente?.id || ''),
        setSingleDoc('movimientos', dia, {
          ingresos: newIngresos,
        }),
      ];
      await Promise.all(shortProms);
      getMovimientos();
      return;
    }
    const finalPromises = [];
    const clienteUpdated = (await getSingleDoc(
      'clientes',
      cliente?.id || ''
    )) as ClientType;
    //Check si esta ctacte y desconectar precio
    const ctaItem = items?.find((i) =>
      i.codigo.some((c) => c === ProductosCargados.ctacte.codigo[0])
    );
    if (cliente) {
      const updateData: Record<string, any> = {};

      if (ctaItem) {
        updateData.saldo =
          (updateData.saldo ?? clienteUpdated.saldo) - ctaItem.precio;
      }

      if (pagoParcial && total !== undefined) {
        const neto = total - pagoParcial;
        updateData.saldo = (updateData.saldo ?? clienteUpdated.saldo) + neto;
      }
      const contieneCuota = items?.some((i) =>
        i.codigo.some((c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT)
      );

      if (contieneCuota) {
        // Restaurar datos previos
        updateData.vencimiento = cliente.vencimiento;
        updateData.ingresoVencido = cliente.ingresoVencido;

        // Verificar si el cliente debería volver a estar inactivo
        const vencimientoDate = new Date(cliente.vencimiento.seconds * 1000);
        const vencimientoGracia = addMonths(vencimientoDate, 1);
        const ahora = new Date();

        if (isAfter(ahora, vencimientoGracia) && cliente.activo !== false) {
          updateData.activo = false;
        }
      }

      // Solo hacer la actualización si hay cambios
      if (Object.keys(updateData).length > 0) {
        finalPromises.push(setSingleDoc('clientes', cliente.id, updateData));
      }
    }
    const findProductos = items?.map((p) => getSingleDoc('productos', p.id));
    const productosUpd = await Promise.all(findProductos as any);
    const filtered = productosUpd.filter((i) => i);
    const resultProductos = filtered?.map((p) => {
      const itemEncontrado = items?.find((it) => it.id === p.id);
      return {
        ...p,
        cantidad: itemEncontrado?.acumulable
          ? p.cantidad + (itemEncontrado?.unidades as number)
          : 100,
      };
    });
    const newProductos = productos?.map((p) => {
      const itemEncontrado = resultProductos?.find((it) => it.id === p.id);
      if (itemEncontrado) return itemEncontrado;
      return p;
    });
    if (newProductos) {
      setProductos(newProductos);
    }
    if (
      items?.some((i) =>
        i.codigo.some((c) => c === codigos.CUOTAGYM || c === codigos.CUOTAGYMFT)
      )
    ) {
    }
    resultProductos?.forEach((r) =>
      finalPromises.push(
        setSingleDoc('productos', r.id, {
          cantidad: r.cantidad,
        })
      )
    );
    if (resultProductos.some((p) => p.acumulable)) {
      await updateProductosLastStamp();
    }
    finalPromises.push(
      setSingleDoc('movimientos', dia, {
        ingresos: newIngresos,
      })
    );
    await Promise.all(finalPromises);
    getMovimientos();
  };
  const deleteEgreso = async (dia: string, seconds: number) => {
    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      dia
    )) as MovimientosType;

    // Filtrar el egreso eliminado
    const newEgresos = movimientoFetched.egresos.filter(
      (i) => i?.fecha?.seconds !== seconds
    );

    const finalPromises = [];

    // Buscar los items del egreso a eliminar
    const { items } =
      movimientoFetched.egresos.find((i) => i?.fecha?.seconds === seconds) ??
      {};

    // Obtener los documentos de cada producto involucrado en el egreso
    const findProductos = items?.map((p) => getSingleDoc('productos', p.id));
    const productosUpd = await Promise.all(findProductos as any);
    const filtered = productosUpd.filter((i) => i); // Filtrar productos válidos

    // Actualizar cantidades de productos
    const resultProductos = filtered?.map((p) => {
      const itemEncontrado = items?.find((it) => it.id === p.id);
      return {
        ...p,
        cantidad: itemEncontrado?.acumulable
          ? p.cantidad - (itemEncontrado?.unidades as number)
          : 0, // Ajustar si no es acumulable
      };
    });

    // Actualizar el estado local de productos
    const newProductos = productos?.map((p) => {
      const itemEncontrado = resultProductos?.find((it) => it.id === p.id);
      if (itemEncontrado) return itemEncontrado;
      return p;
    });

    if (newProductos) {
      setProductos(newProductos);
    }

    // Guardar en la base de datos cada producto actualizado
    resultProductos?.forEach((r) =>
      finalPromises.push(
        setSingleDoc('productos', r.id, {
          cantidad: r.cantidad,
        })
      )
    );

    // Si hay productos acumulables, actualizar la última modificación
    if (resultProductos.some((p) => p.acumulable)) {
      await updateProductosLastStamp();
    }

    // Guardar el movimiento actualizado sin el egreso eliminado
    finalPromises.push(
      setSingleDoc('movimientos', dia, {
        egresos: newEgresos,
      })
    );

    // Ejecutar todas las actualizaciones en paralelo
    await Promise.all(finalPromises);
    getMovimientos();
  };
  const IngresosEfectivo = filterByTipo('Efectivo', ingresos);
  const TotalIngresosEfectivo = IngresosEfectivo?.reduce((acc, it) => {
    return (
      acc + (typeof it.pagoParcial === 'number' ? it.pagoParcial : it.total)
    );
  }, 0);
  const IngresosMercadopago = filterByTipo('Mercadopago', ingresos);
  const TotalIngresosMercadopago = IngresosMercadopago?.reduce((acc, it) => {
    return (
      acc + (typeof it.pagoParcial === 'number' ? it.pagoParcial : it.total)
    );
  }, 0);
  const IngresosData = {
    Efectivo: {
      movimientos: IngresosEfectivo,
      total: TotalIngresosEfectivo || 0,
    },
    Mercadopago: {
      movimientos: IngresosMercadopago,
      total: TotalIngresosMercadopago || 0,
    },
    Total: (TotalIngresosEfectivo || 0) + (TotalIngresosMercadopago || 0),
  };
  const EgresosEfectivo = filterByTipo('Efectivo', egresos);
  const TotalEgresosEfectivo = EgresosEfectivo?.reduce((acc, it) => {
    return (
      acc + (typeof it.pagoParcial === 'number' ? it.pagoParcial : it.total)
    );
  }, 0);
  const EgresosMercadopago = filterByTipo('Mercadopago', egresos);
  const TotalEgresosMercadopago = EgresosMercadopago?.reduce((acc, it) => {
    return (
      acc + (typeof it.pagoParcial === 'number' ? it.pagoParcial : it.total)
    );
  }, 0);
  const EgresosData = {
    Efectivo: {
      movimientos: EgresosEfectivo,
      total: TotalEgresosEfectivo || 0,
    },
    Mercadopago: {
      movimientos: EgresosMercadopago,
      total: TotalEgresosMercadopago || 0,
    },
    Total: (TotalEgresosEfectivo || 0) + (TotalEgresosMercadopago || 0),
  };
  const CajaTotal = {
    Ingresos: IngresosData.Total || 0,
    Egresos: EgresosData.Total || 0,
    Neto: (IngresosData.Total || 0) - (EgresosData.Total || 0),
    NetoMercadopago:
      (caja?.montoInicial.Mercadopago || 0) +
      IngresosData.Mercadopago.total -
      EgresosData.Mercadopago.total,
    NetoEfectivo:
      (caja?.montoInicial.Efectivo || 0) +
      IngresosData.Efectivo.total -
      EgresosData.Efectivo.total,
  };
  return (
    <MovimientosContext.Provider
      value={{
        movimientos,
        loadingCaja,
        loadingMovimientos,
        getMovimientos,
        egresos,
        IngresosData,
        ingresos,
        deleteIngreso,
        EgresosData,
        deleteEgreso,
        setSelectedDate,
        caja,
        abrirCaja,
        cerrarCaja,
        CajaTotal,
        TotalCtaCte,
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
