import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ActualizarStock } from '@/helpers/cobros/ConfirmFunctions';
import { getEstado } from '@/helpers/cobros/getEstado';
import { getUpdatedCompras } from '@/helpers/cobros/getUpdatedCompras';
import { getUpdatedReservas } from '@/helpers/cobros/getUpdatedReservas';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import {
  Estados,
  MovimientosType,
  PedidoType,
  ProductoType,
} from '@/types/types';
import { useToast } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useGetProductos from './data/useGetProductos';

const usePedidosForm = (movimiento: PedidoType) => {
  const { reservas, compras } = useOnCurso();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentMov, setCurrentMov] = useState(movimiento);
  const { user, refreshUser } = useUser();
  const { id, movimientos } = currentMov;
  const router = useRouter();
  const { productos, setProductos, checkForUpdates } = useGetProductos();
  const estado = getEstado(movimientos);
  const toast = useToast();
  const fecha = useMemo(() => {
    return formatearFecha(id);
  }, [id]);
  const fetchNewReserva = async () => {
    try {
      const mov = (await getSingleDoc('movimientos', fecha)) as MovimientosType;
      const thisMov = mov.reservas.find((r) => r.id === movimiento.id);
      if (thisMov) {
        setCurrentMov(thisMov);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const fetchNewCompra = async () => {
    try {
      const mov = (await getSingleDoc('movimientos', fecha)) as MovimientosType;
      const thisMov = mov.compras.find((r) => r.id === movimiento.id);
      if (thisMov) {
        setCurrentMov(thisMov);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (!movimiento.isPago) return;
    if (movimiento?.movimientos?.Finalizado?.fecha) {
      setCurrentMov(movimiento);
      return;
    }
    const newMov = compras?.find((r) => r.id === movimiento.id);
    if (newMov) {
      setCurrentMov(newMov);
    } else fetchNewCompra();
  }, [JSON.stringify(compras)]);
  useEffect(() => {
    if (movimiento.isPago) return;
    if (movimiento?.movimientos?.Finalizado?.fecha) {
      setCurrentMov(movimiento);
      return;
    }
    const newMov = reservas?.find((r) => r.id === movimiento.id);
    if (newMov) {
      setCurrentMov(newMov);
    } else fetchNewReserva();
  }, [JSON.stringify(reservas)]);
  // Test para actualizar (devuelve true o false)
  const testUpdate = (newItems: ProductoType[]) => {
    if (estado === 'Finalizado' || !reservas) {
      toast({
        title: 'Finalizado',
        description: 'No se puede actualizar un pedido finalizado',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (
      estado === 'Pendiente' &&
      ['Cuadrilla', 'Superadmin'].every((r) => r !== user?.rol)
    ) {
      toast({
        title: 'No autorizado',
        description: 'No tienes permisos para actualizar un pedido pendiente',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    const faltantes = newItems.filter(
      (i) => i?.unidades && i?.unidades > i.cantidad
    );
    if (faltantes.length > 0) {
      toast({
        title: 'Error',
        description: `Hay faltante de stock para los siguientes productos: ${faltantes
          .map((i) => i.nombre)
          .join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };
  const updateInventario = async (sobrantes: ProductoType[]) => {
    if (!user) return;

    // Creamos una copia del inventario actual
    const newInventario = [...user.inventario];

    sobrantes.forEach((sobrante) => {
      const index = newInventario.findIndex((p) => p.id === sobrante.id);

      if (index !== -1) {
        // Si el producto ya existe, sumamos las cantidades
        newInventario[index].cantidad += sobrante.cantidad;
      } else {
        // Si no existe, lo agregamos
        newInventario.push({ ...sobrante, unidades: 0 });
      }
    });
    await setSingleDoc('users', user.id, {
      inventario: newInventario,
    });
  };
  const updatePedido = async (
    id: string,
    updatedPedido: PedidoType | null,
    newItems: ProductoType[],
    sobrantes: ProductoType[],
    onClose: () => void
  ) => {
    const canUpdate = testUpdate(newItems);
    if (!canUpdate || !reservas) return;
    const newEstado = Estados[Estados.indexOf(estado) + 1];
    setLoadingUpdate(true);

    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      fecha
    )) as MovimientosType;
    try {
      if (estado === 'Inicializado') {
        await ActualizarStock(
          newItems,
          productos || [],
          setProductos,
          checkForUpdates,
          false
        );
      }
      if (estado === 'En curso' && sobrantes.some((s) => s?.cantidad > 0)) {
        await updateInventario(sobrantes);
        await refreshUser();
      }
      await setSingleDoc('movimientos', fecha, {
        reservas: getUpdatedReservas(
          id,
          movimientoFetched.reservas,
          newEstado,
          updatedPedido,
          sobrantes,
          user?.id
        ),
      });
      onClose();
      await setSingleDoc('movimientos', 'enCurso', {
        reservas:
          newEstado === 'Finalizado'
            ? reservas?.filter((d) => d.id !== id)
            : getUpdatedReservas(
                id,
                reservas,
                newEstado,
                updatedPedido,
                sobrantes,
                user?.id
              ),
      });
      toast({
        title: 'Éxito',
        description: 'Pedido actualizado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingUpdate(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };
  const updateCompra = async (newPedido: PedidoType, onClose: () => void) => {
    if (!compras) return;
    setLoadingUpdate(true);
    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      fecha
    )) as MovimientosType;
    const { items, confirmedItems } = newPedido;
    const toUpdate = items.filter(
      (i) => i.isChecked && !confirmedItems?.some((ci) => ci.id === i.id)
    );
    const newConfirmed = confirmedItems
      ? [...confirmedItems, ...toUpdate]
      : toUpdate;
    const FinalPedido = { ...newPedido, confirmedItems: newConfirmed };
    const newEstado = items.some((i) => !i.isChecked)
      ? 'En curso'
      : 'Finalizado';
    const { inventario, ...restUser } = user ?? {};
    const newCambio = {
      user: restUser,
      items: toUpdate,
      date: Timestamp.now(),
    };
    const cambios = FinalPedido?.movimientos['En curso']?.cambios
      ? [...FinalPedido?.movimientos['En curso']?.cambios, newCambio]
      : [newCambio];

    try {
      await ActualizarStock(
        toUpdate,
        productos || [],
        setProductos,
        checkForUpdates,
        true
      );
      await setSingleDoc('movimientos', fecha, {
        compras: getUpdatedCompras(
          newPedido.id,
          movimientoFetched.compras,
          newEstado,
          FinalPedido,
          cambios,
          user?.id
        ),
      });
      onClose();
      await setSingleDoc('movimientos', 'enCurso', {
        compras:
          newEstado === 'Finalizado'
            ? compras?.filter((d) => d.id !== id)
            : getUpdatedCompras(
                newPedido.id,
                compras,
                newEstado,
                FinalPedido,
                cambios,
                user?.id
              ),
      });
      toast({
        title: 'Éxito',
        description: 'Pedido actualizado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingUpdate(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };
  const restoreStockCompra = async () => {
    if (estado === 'Inicializado') return;
    const { items } = currentMov;
    const promisesPRD = items
      .filter((it) => it.isChecked)
      .map((i) => getSingleDoc('productos', i.id));
    const productosUpdated = (await Promise.all(promisesPRD)) as ProductoType[];
    const promisesUpdate = productosUpdated.map((p) => {
      const itemFind = items.find((i) => i.id === p?.id);
      if (itemFind) {
        console.log({ itemFind, items });
        console.log({
          items,
          p,
          itemFind,
          cantidad: p?.cantidad - (itemFind?.unidades || 0),
        });
        return setSingleDoc('productos', p?.id || '', {
          cantidad: p?.cantidad - (itemFind?.unidades || 0),
        });
      }
    });
    const newProductos = productos?.map((p) => {
      const pFind = items.find((i) => i.id === p?.id);
      const puFind = productosUpdated.find((i) => i.id === p?.id);
      if (pFind && puFind)
        return {
          ...puFind,
          cantidad: puFind?.cantidad - (pFind?.unidades || 0),
        };
      return p;
    });
    if (newProductos) setProductos(newProductos);
    await Promise.all(promisesUpdate);
    await updateProductosLastStamp();
  };
  const restoreStock = async () => {
    if (estado === 'Inicializado') return;
    const { items } = currentMov;
    const promisesPRD = items.map((i) => getSingleDoc('productos', i.id));
    const productosUpdated = (await Promise.all(promisesPRD)) as ProductoType[];
    const promisesUpdate = productosUpdated.map((p) => {
      const itemFind = items.find((i) => i.id === p?.id);
      if (itemFind) {
        return setSingleDoc('productos', p?.id || '', {
          cantidad: p?.cantidad + (itemFind?.unidades || 0),
        });
      }
    });
    const newProductos = productos?.map((p) => {
      const pFind = items.find((i) => i.id === p?.id);
      const puFind = productosUpdated.find((i) => i.id === p?.id);
      if (pFind && puFind)
        return {
          ...puFind,
          cantidad: puFind?.cantidad + (pFind?.unidades || 0),
        };
      return p;
    });
    if (newProductos) setProductos(newProductos);
    await Promise.all(promisesUpdate);
    await updateProductosLastStamp();
  };
  const deleteFunc = async () => {
    if (estado === 'Finalizado') {
      toast({
        title: 'Finalizado',
        description: 'No se puede eliminar un pedido finalizado',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoadingDelete(true);
    try {
      const newReservas = reservas?.filter((r) => r.id !== id);
      const movimientoFetched = (await getSingleDoc(
        'movimientos',
        fecha
      )) as MovimientosType;
      const newDayReservas = movimientoFetched.reservas.filter(
        (r) => r.id !== id
      );

      if (estado !== 'Inicializado') {
        await restoreStock();
      }
      const promises = [
        setSingleDoc('movimientos', fecha, {
          reservas: newDayReservas,
        }),
        setSingleDoc('movimientos', 'enCurso', {
          reservas: newReservas,
        }),
      ];
      await Promise.all(promises);
      toast({
        title: 'Éxito',
        description: 'Pedido eliminado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
      router.push('/');
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Error al eliminar el pedido',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingDelete(false);
    }
  };
  const deleteFuncCompra = async () => {
    if (estado === 'Finalizado' && user?.rol !== 'Superadmin') {
      toast({
        title: 'Finalizado',
        description: 'No tienes autorización para eliminar compras finalizadas',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoadingDelete(true);
    try {
      const newCompras = compras?.filter((r) => r.id !== id);
      const movimientoFetched = (await getSingleDoc(
        'movimientos',
        fecha
      )) as MovimientosType;
      const newDayCompras = movimientoFetched.compras.filter(
        (r) => r.id !== id
      );

      if (estado !== 'Inicializado') {
        await restoreStockCompra();
      }
      const promises = [
        setSingleDoc('movimientos', fecha, {
          compras: newDayCompras,
        }),
        setSingleDoc('movimientos', 'enCurso', {
          compras: newCompras,
        }),
      ];
      await Promise.all(promises);
      toast({
        title: 'Éxito',
        description: 'Pedido eliminado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
      router.push('/');
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error',
        description: 'Error al eliminar el pedido',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingDelete(false);
    }
  };
  return {
    loadingUpdate,
    loadingDelete,
    currentMov,
    user,
    estado,
    productos,
    updatePedido,
    updateCompra,
    deleteFuncCompra,
    deleteFunc,
  };
};

export default usePedidosForm;
