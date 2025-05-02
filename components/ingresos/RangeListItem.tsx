import dateTexto from '@/helpers/dateTexto';
import useSaldoData from '@/hooks/users/useSaldoData';
import { ClientType } from '@/types/types';
import { Flex, Icon, ListItem, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { TiWarning } from 'react-icons/ti';
const RangeListItem = ({ client }: { client: ClientType }) => {
  const {
    nombre,
    apellido,

    DNI,

    horarioIngreso,
  } = client;
  const { estado, color } = useSaldoData(client);
  const estadoIcons = {
    Habilitado: MdCheckCircle,
    Inhabilitado: MdCancel,
    Vencido: TiWarning,
    Inactivo: MdCancel,
  };
  return (
    <ListItem target='_blank' href={`/ClientesID/${DNI}`} as={Link}>
      <Flex
        p={1}
        borderRadius={10}
        fontSize={16}
        justify='space-between'
        _hover={{ boxShadow: `0 0 5px` }}
      >
        <Text>{dateTexto(horarioIngreso?.seconds || 0).hourDate}</Text>
        <Flex _groupHover={{ fontWeight: 'bold' }} align='center' gap={1}>
          <Text>
            {nombre} {apellido}
          </Text>
          <Icon
            title={estado}
            color={color}
            fontSize='xl'
            as={estadoIcons[estado]}
          />
        </Flex>
      </Flex>
    </ListItem>
  );
};

export default RangeListItem;
