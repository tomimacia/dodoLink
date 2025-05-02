import { ViewIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';

const ShowHidePassword = ({ password }: { password: string }) => {
  const [show, setShow] = useState(false);
  return (
    <Flex gap={2} justify='space-between' align='center'>
      <Text>{show ? password : '*'.repeat(password.length)}</Text>
      <IconButton
        bg='transparent'
        size='sm'
        onClick={() => setShow((prev) => !prev)}
        aria-label='viewicon'
        icon={<ViewIcon />}
      />
    </Flex>
  );
};

export default ShowHidePassword;
