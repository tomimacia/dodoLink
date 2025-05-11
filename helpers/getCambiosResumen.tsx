import { PedidoType, ProductoType } from '@/types/types';
import isEqual from 'lodash/isEqual';

export const getCambiosResumen = (
  prev: PedidoType,
  updated: PedidoType,
  sobrantes: ProductoType[]
): string | null => {
  const cambios: string[] = [];

  // Verificar cambios generales
  if (prev.cliente !== updated.cliente)
    cambios.push(`cliente: ${prev.cliente} → ${updated.cliente}`);
  if (prev.detalle !== updated.detalle)
    cambios.push(`detalle: ${prev.detalle} → ${updated.detalle}`);
  if (prev.tramo !== updated.tramo)
    cambios.push(`tramo: ${prev?.tramo || 0} → ${updated.tramo}`);

  if (!isEqual(prev.mapCoords, updated.mapCoords))
    cambios.push(`ubicación actualizada`);

  // Comparar items
  const cambioUnidades: string[] = [];

  const prevItemsMap = Object.fromEntries(
    prev.items.map((item) => [item.nombre, item])
  );
  const updatedItemsMap = Object.fromEntries(
    updated.items.map((item) => [item.nombre, item])
  );

  const prevItemsNombres = Object.keys(prevItemsMap);
  const updatedItemNombres = Object.keys(updatedItemsMap);

  // Detectar eliminados
  const removedItems = prevItemsNombres.filter((id) => !updatedItemsMap[id]);
  if (removedItems.length) {
    cambios.push(`Items eliminados: ${removedItems.join(', ')}`);
  }

  // Detectar agregados
  const addedItems = updatedItemNombres.filter((id) => !prevItemsMap[id]);
  if (addedItems.length) {
    cambios.push(`Items agregados: ${addedItems.join(', ')}`);
  }

  // Comparar cambios en items existentes
  for (const id of prevItemsNombres) {
    const prevItem = prevItemsMap[id];
    const updatedItem = updatedItemsMap[id];
    if (updatedItem && !isEqual(prevItem, updatedItem)) {
      if (prevItem.unidades !== updatedItem.unidades) {
        cambioUnidades.push(
          `${prevItem.nombre} (${prevItem?.unidades} → ${updatedItem?.unidades})` ||
            'Sin nombre'
        );
      }
    }
  }
  if (cambioUnidades.length) {
    cambios.push(`Items modificados: ${cambioUnidades.join(', ')}`);
  }
  if (sobrantes.length) {
    cambios.push(
      `Sobrantes: ${sobrantes
        .map((p) => `${p.nombre} (${p.cantidad} ${p.medida})`)
        .join(', ')}`
    );
  }

  return cambios.length ? cambios.join(', ') : null;
};
