import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ActualizarStock } from '@/helpers/cobros/ConfirmFunctions';
import { getEstado } from '@/helpers/cobros/getEstado';
import { getUpdatedReservas } from '@/helpers/cobros/getUpdatedReservas';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
import {
  Estados,
  MovimientosType,
  PedidoType,
  ProductoType,
} from '@/types/types';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useGetProductos from './data/useGetProductos';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';

const usePedidosForm = (movimiento: PedidoType) => {
  const { reservas } = useOnCurso();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentMov, setCurrentMov] = useState(movimiento);
  const { user, refreshUser } = useUser();
  const { id, isPago, movimientos } = currentMov;
  const router = useRouter();
  const { productos, setProductos } = useGetProductos();
  const estado = getEstado(movimientos);
  const toast = useToast();
  const fecha = useMemo(() => {
    return formatearFecha(id);
  }, [id]);
  const fetchNewMov = async () => {
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
  useEffect(() => {
    if (movimiento?.movimientos?.Finalizado?.fecha) {
      setCurrentMov(movimiento);
      return;
    }
    const newMov = reservas?.find((r) => r.id === movimiento.id);
    if (newMov) {
      setCurrentMov(newMov);
    } else fetchNewMov();
  }, [reservas]);

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
    sobrantes: ProductoType[]
  ) => {
    const canUpdate = testUpdate(newItems);
    if (!canUpdate || !reservas) return;
    const newEstado = Estados[Estados.indexOf(estado) + 1];
    setLoadingUpdate(true);

    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      fecha
    )) as MovimientosType;
    const field = isPago ? 'compras' : 'reservas';
    try {
      if (estado === 'Inicializado' || estado === 'En curso') {
        await ActualizarStock(newItems, productos || [], setProductos, false);
      }
      if (estado === 'En curso' && sobrantes.some((s) => s?.cantidad > 0)) {
        await updateInventario(sobrantes);
        await refreshUser();
      }
      const prom1 = setSingleDoc('movimientos', fecha, {
        [field]: getUpdatedReservas(
          id,
          movimientoFetched.reservas,
          newEstado,
          updatedPedido,
          user?.id
        ),
      });
      const prom2 = setSingleDoc('movimientos', 'enCurso', {
        [field]:
          newEstado === 'Finalizado'
            ? reservas?.filter((d) => d.id !== id)
            : getUpdatedReservas(
                id,
                reservas,
                newEstado,
                updatedPedido,
                user?.id
              ),
      });
      await Promise.all([prom1, prom2]);
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
    await Promise.all(promisesUpdate);
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
        updateProductosLastStamp(),
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
    deleteFunc,
  };
};

export default usePedidosForm;
