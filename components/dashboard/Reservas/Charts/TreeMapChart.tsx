import { ProductoType } from '@/types/types';
import { Flex } from '@chakra-ui/react';
import { scaleOrdinal } from 'd3-scale'; // Para asignar colores
import { Cell, ResponsiveContainer, Tooltip, Treemap } from 'recharts';

export default function TreeMapProductos({
  productos,
}: {
  productos: ProductoType[];
}) {
  // Usamos scaleOrdinal para asignar colores diferentes a cada producto
  const colorScale = scaleOrdinal()
    .domain(productos.map((_, index) => index.toString()))
    .range([
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ]);
  const formatName = (name: string, size: number) => {
    if (name.length < 15) return name;
    if (size > 100) return name; // No truncar si tiene muchas unidades
    if (size > 50) return name.slice(0, 15) + '...'; // Truncar más agresivo si el tamaño es mediano
    return name.slice(0, 10) + '...'; // Truncar si tiene pocas unidades
  };

  const data = {
    name: 'Productos utilizados',
    children: productos
      .map((item, index) => {
        const customSize = (item.unidades || 1) / item.cantidadPorPack;
        return {
          name: formatName(item.nombre, customSize), // Aplicamos la truncación según las unidades
          realName: item.nombre,
          size: customSize, // Aplicamos la escala logarítmica para el tamaño visual
          realSize: item.unidades || 0, // Guardamos el tamaño real para mostrar en el tooltip
          color: colorScale(index.toString()), // Asignamos un color único
        };
      })
      .filter((item) => item.size > 0), // Solo mostramos los que tienen unidades > 0
  };

  return (
    <Flex w='100%' h={500} p={1}>
      <ResponsiveContainer>
        <Treemap
          width={400}
          height={200}
          data={data.children}
          dataKey='size'
          nameKey='name'
          aspectRatio={4 / 3}
          stroke='#fff'
        >
          <Tooltip
            content={({ payload }: any) => {
              const item = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    borderRadius: '5px',
                    color: '#fff',
                  }}
                >
                  <h5 style={{ margin: '0 0 10px' }}>{item?.realName}</h5>
                  {item?.size === item?.realSize ? (
                    <p style={{ margin: 0 }}>Unidades: {item?.realSize}</p>
                  ) : (
                    <p style={{ margin: 0 }}>Packs: {item?.size}</p>
                  )}
                  {/* Mostrar el valor real en el Tooltip */}
                </div>
              );
            }}
          />
          {data.children.map((entry, index) => (
            <Cell key={`cell-${index}`}>
              <div>{entry.name}</div>
            </Cell>
          ))}
        </Treemap>
      </ResponsiveContainer>
    </Flex>
  );
}
