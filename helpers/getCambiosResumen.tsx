import { PedidoType } from '@/types/types';
import isEqual from 'lodash/isEqual';

export const getCambiosResumen = (
  prev: PedidoType,
  updated: PedidoType
): string | null => {
  const cambios: string[] = [];

  // Verificar cambios generales
  if (prev.cliente !== updated.cliente)
    cambios.push(`cliente: ${prev.cliente} → ${updated.cliente}`);
  if (prev.detalle !== updated.detalle)
    cambios.push(`detalle: ${prev.detalle} → ${updated.detalle}`);
  if (prev.tramo !== updated.tramo)
    cambios.push(`tramo: ${prev.tramo} → ${updated.tramo}`);

  if (!isEqual(prev.mapCoords, updated.mapCoords))
    cambios.push(`ubicación actualizada`);

  // Comparar items (de forma más precisa)
  const modificados: string[] = [];

  // Verificar si se eliminaron o agregaron items
  const prevItemsMap = Object.fromEntries(
    prev.items.map((item) => [item.id, item])
  );
  const updatedItemsMap = Object.fromEntries(
    updated.items.map((item) => [item.id, item])
  );

  const prevItemIds = Object.keys(prevItemsMap);
  const updatedItemIds = Object.keys(updatedItemsMap);

  // Detectar eliminados
  const removedItems = prevItemIds.filter((id) => !updatedItemsMap[id]);
  if (removedItems.length) {
    modificados.push(`items eliminados: ${removedItems.join(', ')}`);
  }

  // Detectar agregados
  const addedItems = updatedItemIds.filter((id) => !prevItemsMap[id]);
  if (addedItems.length) {
    modificados.push(`items agregados: ${addedItems.join(', ')}`);
  }

  // Comparar cambios en items existentes
  for (const id of prevItemIds) {
    const prevItem = prevItemsMap[id];
    const updatedItem = updatedItemsMap[id];

    if (updatedItem && !isEqual(prevItem, updatedItem)) {
      if (prevItem.unidades !== updatedItem.unidades) {
        modificados.push(`${prevItem.nombre || 'Sin nombre'} (unidades)`);
      }
      if (prevItem.cantidad !== updatedItem.cantidad) {
        modificados.push(`${prevItem.nombre || 'Sin nombre'} (cantidad)`);
      }
      if (prevItem.cantidadPorPack !== updatedItem.cantidadPorPack) {
        modificados.push(
          `${prevItem.nombre || 'Sin nombre'} (cantidad por pack)`
        );
      }
    }
  }

  if (modificados.length) {
    cambios.push(`items modificados: ${modificados.join(', ')}`);
  }

  return cambios.length ? cambios.join(', ') : null;
};
