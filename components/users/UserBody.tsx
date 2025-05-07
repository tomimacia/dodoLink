import { UserType } from '@/types/types';
import {
  Divider,
  Flex,
  Heading,
  Text,
  Box,
  Stack,
  Badge,
} from '@chakra-ui/react';
import ModalTest from '../Modal/ModalLog';

const UserBody = ({ user }: { user: UserType | null }) => {
  const { nombre, email, rol, inventario, apellido } = user ?? {};
  return (
    <Flex mt={3} gap={4} flexDir='column'>
      {/* Info básica del usuario */}
      <Flex flexDir='column'>
        <Heading size='lg'>
          {nombre} {apellido}
        </Heading>
        <Text fontStyle='italic'>{rol}</Text>
      </Flex>

      {/* Detalles de contacto y botón */}
      <Flex
        w='100%'
        maxW='500px'
        fontSize='lg'
        p={3}
        flexDir='column'
        gap={3}
        border='1px solid'
        borderColor='gray.200'
        borderRadius='md'
        boxShadow='sm'
        bg='white'
        _dark={{ bg: 'gray.800', borderColor: 'gray.600' }}
      >
        <Divider borderColor='gray.300' />
        <Flex align='center' justify='space-between'>
          <Text>Email:</Text>
          <Text fontWeight='medium'>{email}</Text>
        </Flex>
        <Flex justify='flex-end'>
          <ModalTest />
        </Flex>
      </Flex>

      {/* Inventario (si existe) */}
      {inventario && inventario.length > 0 && (
        <Box
          w='100%'
          maxW='500px'
          p={4}
          borderRadius='md'
          bg='gray.50'
          _dark={{ bg: 'gray.700' }}
          boxShadow='sm'
          border='1px solid'
          borderColor='gray.200'
        >
          <Heading size='md' mb={3}>
            Inventario
          </Heading>
          <Stack spacing={2}>
            {inventario.map((item) => (
              <Flex
                key={item.id}
                justify='space-between'
                align='center'
                p={2}
                borderRadius='md'
                bg='white'
                _dark={{ bg: 'gray.800' }}
                boxShadow='xs'
                border='1px solid'
                borderColor='gray.100'
              >
                <Text fontWeight='medium'>{item.nombre}</Text>
                <Badge colorScheme='blue'>
                  {item.cantidad} {item.medida}
                </Badge>
              </Flex>
            ))}
          </Stack>
        </Box>
      )}
    </Flex>
  );
};

export default UserBody;
