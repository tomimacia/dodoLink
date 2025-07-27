import {
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';

const StatCard = ({
  label,
  value,
  helper,
  color,
  props,
  p,
}: {
  label: string;
  value: string | number;
  helper?: string;
  color: string;
  props?: any;
  p?: number;
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  return (
    <Stat
      p={p || 4}
      borderRadius='xl'
      shadow='md'
      bg={bg}
      borderBottom='2px solid'
      borderLeft='5px solid'
      borderColor={color}
      {...props}
    >
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
      {helper && <StatHelpText>{helper}</StatHelpText>}
    </Stat>
  );
};

export default StatCard;
