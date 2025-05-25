import { SimpleGrid } from '@chakra-ui/react';
import StatCard from './StatCard';
type StatDataType = {
  label: string;
  value: string | number;
  color: string;
  helper?: string;
};
const StatsData = ({ data }: { data: StatDataType[] }) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={5}>
      {data.map((r) => {
        const { label, value, color, helper } = r ?? {};
        return (
          <StatCard
            key={label + '-stat-reserva-key'}
            label={label}
            value={value}
            color={color}
            helper={helper}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default StatsData;
