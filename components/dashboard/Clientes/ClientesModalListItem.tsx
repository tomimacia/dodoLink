import PopoverInfoIcon from '@/components/inicio/PopoverInfoIcon';
import { addDots } from '@/helpers/addDots';
import useSaldoData from '@/hooks/users/useSaldoData';
import { ClientType } from '@/types/types';
import { Flex, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { TiWarning } from 'react-icons/ti';

const ClientesModalListItem = ({
  c,
  isSaldo,
}: {
  c: ClientType;
  isSaldo: boolean;
}) => {
  const { estado, color } = useSaldoData(c);
  const estadoIcons = {
    Habilitado: MdCheckCircle,
    Inhabilitado: MdCancel,
    Vencido: TiWarning,
    Inactivo: MdCancel,
  };
  return (
    <Flex align='center' justify='space-between'>
      <Flex align='center' gap={1}>
        {isSaldo && (
          <Icon
            title={estado}
            color={color}
            fontSize='xl'
            as={estadoIcons[estado]}
          />
        )}
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
