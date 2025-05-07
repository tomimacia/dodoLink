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
    cambios.push(`items eliminados: ${removedItems.join(', ')}`);
  }

  // Detectar agregados
  const addedItems = updatedItemNombres.filter((id) => !prevItemsMap[id]);
  if (addedItems.length) {
    cambios.push(`items agregados: ${addedItems.join(', ')}`);
  }

  // Comparar cambios en items existentes
  for (const id of prevItemsNombres) {
    const prevItem = prevItemsMap[id];
    const updatedItem = updatedItemsMap[id];
    if (updatedItem && !isEqual(prevItem, updatedItem)) {
      if (prevItem.unidades !== updatedItem.unidades) {
        console.log(prevItem);
        cambioUnidades.push(prevItem.nombre || 'Sin nombre');
      }
    }
  }
  if (cambioUnidades.length) {
    cambios.push(`items modificados: ${cambioUnidades.join(', ')}`);
  }

  return cambios.length ? cambios.join(', ') : null;
};
