import { addDots } from '@/helpers/addDots';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type GridItemType = {
  title: string;
  total: number;
  aspectRatio: number;
  color: string;
};

const GridWithFlex = ({
  data,
  isCaja,
}: {
  data: GridItemType[];
  isCaja?: boolean;
}) => {
  const customHeigth = ['100px', '110px', '120px', '130px'];
  const router = useRouter();
  return (
    <Flex maxW='650px' fontSize='xl' w='100%' flexDir='column' gap={2}>
      <Flex w='100%' justify='space-between' flexDir='row' gap={2}>
        <Flex
          flexDir='column'
          h={customHeigth}
          boxShadow='0 0 3px'
          borderRadius={5}
          flex={1}
          gap={2}
          p={2}
          color='white'
          bg={data[0].color}
          _hover={
            isCaja ? { boxShadow: `0 0 5px ${data[0].color}` } : undefined
          }
          cursor={isCaja ? 'pointer' : undefined}
          onClick={isCaja ? () => router.push('/Caja/Ingresos') : undefined}
        >
          <>
            <Flex gap={1} flexDir='column'>
              <Text>{data[0].title}</Text>
              <Divider borderColor='gray.400' w='100%' />
            </Flex>
            <Text fontSize='3xl'>${addDots(data[0].total)}</Text>
          </>
        </Flex>
        <Flex
          h={customHeigth}
          flexDir='column'
          boxShadow='0 0 3px'
          borderRadius={5}
          flex={1}
          gap={2}
          p={2}
          color='white'
          bg={data[1].color}
          _hover={
            isCaja ? { boxShadow: `0 0 5px ${data[1].color}` } : undefined
          }
          cursor={isCaja ? 'pointer' : undefined}
          onClick={isCaja ? () => router.push('/Caja/Egresos') : undefined}
        >
          <Flex gap={1} flexDir='column'>
            <Text>{data[1].title}</Text>
            <Divider borderColor='gray.400' w='100%' />
          </Flex>
          <Text fontSize='3xl'>${addDots(data[1].total)}</Text>
        </Flex>
      </Flex>
      <Flex
        h={customHeigth}
        flexDir='column'
        boxShadow='0 0 3px'
        borderRadius={5}
        gap={2}
        p={2}
        color='white'
        bg={data[2].color}
      >
        <Flex flexDir='row' justify='space-between' w='100%' h='100%'>
          {/* Sección izquierda (texto) */}
          <Flex flexDir='column' flex={1}>
            <Text fontWeight='bold'>{data[2].title}</Text>
            <Divider borderColor='gray.400' w='100%' />
            <Text fontSize='4xl'>${addDots(data[2].total)}</Text>
          </Flex>

          {/* Sección derecha (gráfico de torta) */}
          <Flex flex={1} justify='center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data.slice(0, 2)} // Solo Efectivo y MercadoPago
                  dataKey='total'
                  nameKey='title'
                  cx='50%'
                  cy='50%'
                  outerRadius={40}
                  startAngle={-270}
                >
                  {data.slice(0, 2).map((_, i) => (
                    <Cell stroke='0' key={i + 'cellkey'} fill={data[i].color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GridWithFlex;
