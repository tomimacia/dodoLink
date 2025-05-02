import ClockLive from 'react-live-clock';
import { Flex } from '@chakra-ui/react';
const ClockComp = () => {
  return (
    <Flex w='80px'>
      <ClockLive
        style={{
          fontWeight: 'bold',
        }}
        format={'HH:mm:ss'}
        ticking={true}
      />
    </Flex>
  );
};
export default ClockComp;
