import { Box, Flex, Text } from '@chakra-ui/react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const ReservasPieChart = ({
  pieData,
  colores,
  loading,
}: {
  pieData: any;
  colores: {
    reservas: string;
    retiros: string;
    duracion: string;
  };
  loading: boolean;
}) => {
  return (
    <Flex
      flexDir='column'
      minW='200px'
      maxW='300px'     
      p={2}
      shadow='md'
      borderRadius='xl'
    >
      <Text mb={3} fontWeight='bold'>
        Reservas / Retiros
      </Text>
      <Flex my='auto'>
        {loading ? (
          <Box h={180} />
        ) : (
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={80}
                label
              >
                <Cell fill={colores.reservas} />
                <Cell fill={colores.retiros} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Flex>
    </Flex>
  );
};

export default ReservasPieChart;
