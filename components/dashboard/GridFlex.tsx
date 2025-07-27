import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard';

type GridItemType = {
  title: string;
  total: number;
  aspectRatio: number;
  color: string;
  entryLabel: string;
};

const GridWithFlex = ({
  data,
  loading,
}: {
  data: GridItemType[];
  loading: boolean;
}) => {
  const colores = {
    reservas: '#098f72',
    retiros: '#2269F3',
    duracion: '#F97316',
  };

  return (
    <Flex gap={4} w='100%' align='center' flexWrap='wrap' borderRadius='md'>
      <SimpleGrid columns={[1, 2]} spacing={5}>
        {data.map((d) => (
          <Link key={d.title} href={`/${d.entryLabel}`}>
            <StatCard
              props={{
                _hover: { boxShadow: `0 0 8px ${d.color}` },
                transition: 'all 0.2s',
              }}
              label={d.title}
              value={d.total}
              color={d.color}
            />
          </Link>
        ))}
      </SimpleGrid>

      {/* Pie Chart */}
      {data.length > 1 && (
        <Box
          borderRadius='xl'
          boxShadow='md'
          p={2}
          h='100%'
          w='90px'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {!loading && (
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  dataKey='total'
                  nameKey='title'
                  cx='50%'
                  cy='50%'
                  outerRadius={35}
                  innerRadius={15}
                  startAngle={-270}
                  endAngle={90}
                >
                  {data.map((d, i) => (
                    <Cell key={i} stroke='none' fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      )}
    </Flex>
  );
};

export default GridWithFlex;
