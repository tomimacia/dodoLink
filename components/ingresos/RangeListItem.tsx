import dateTexto from '@/helpers/dateTexto';
import { Flex, Icon, ListItem, Text } from '@chakra-ui/react';
import Link from 'next/link';
const RangeListItem = ({ client }: { client: any }) => {
  const { nombre, apellido, DNI, horarioIngreso } = client;
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
          <Icon color='red' fontSize='xl' />
        </Flex>
      </Flex>
    </ListItem>
  );
};

export default RangeListItem;
