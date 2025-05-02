import PopoverInfoIcon from '@/components/inicio/PopoverInfoIcon';
import { addDots } from '@/helpers/addDots';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

const ClientesModalListItem = ({
  c,
  isSaldo,
}: {
  c: any;
  isSaldo: boolean;
}) => {
  return (
    <Flex align='center' justify='space-between'>
      <Flex align='center' gap={1}>
        <Text>
          {c.nombre} {c.apellido}{' '}
        </Text>
        {isSaldo && <Text>${addDots(c.saldo)}</Text>}

        {!isSaldo && (
          <Flex color={c.saldo > 0 ? 'green.600' : 'red.600'}>
            {c.saldo !== 0 && (
              <PopoverInfoIcon>${addDots(c.saldo)}</PopoverInfoIcon>
            )}
          </Flex>
        )}
      </Flex>
      <Link target='_blank' href={`/ClientesID/${c.id}`}>
        Ver
      </Link>
    </Flex>
  );
};

export default ClientesModalListItem;
