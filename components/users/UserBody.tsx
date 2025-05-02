import { UserType } from '@/types/types';
import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import ModalTest from '../Modal/ModalLog';

const UserBody = ({ user }: { user: UserType | null }) => {
  const { nombre, email, rol, apellido } = user ?? {};
  return (
    <Flex mt={3} gap={2} flexDir='column'>
      <Flex flexDir='column'>
        <Heading size='lg'>
          {nombre} {apellido}
        </Heading>
        <Text fontStyle='italic'>{rol}</Text>
      </Flex>
      <Flex w='100%' maxW='500px' fontSize='lg' p={2} flexDir='column' gap={1}>
        <Divider borderColor='gray' />
        <Flex align='center' justify='space-between' gap={2}>
          <Text>Email:</Text>
          <Text>
            <b>{email}</b>
          </Text>
        </Flex>
        <Flex p={5}>
          <ModalTest />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserBody;
