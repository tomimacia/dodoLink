import { useUser } from '@/context/userContext';
import {
  Box,
  Flex,
  Image,
  Link,
  useBreakpointValue,
  useColorModeValue
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import LoginScreen from '../auth/LoginScreen';
import ColorModeSwitch from '../ColorModeSwitch';
import HamburguerButton from './HamburguerButton';
import NotificationButton from './NotificationButton';

export default function Navbar({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { user, refreshUser } = useUser();
  const isOnline = user !== null;
  const imageNavbarSize = useBreakpointValue([45, 70]);
  const customImageBG = useColorModeValue('gray.500', 'gray.700');
  return (
    <Box
      bg={customImageBG}
      position='relative'
      zIndex={100}
      pos='fixed'
      top={0}
      as='nav'
      w='100%'
    >
      {isOnline && (
        <Flex
          fontSize={[13, 14, 15, 16, 18, 20]}
          align='center'
          fontWeight='medium'
          h={['3.6rem', '4.9rem']}
          backdropFilter='blur(20px)'
          justify='center'
          px={0}
        >
          <Flex
            h='100%'
            gap={3}
            align='center'
            w='100%'
            justify='space-between'
          >
            <Flex h='100%' gap={2}>
              <HamburguerButton mx={[1, 2, 5, 5, 5]} setOpen={setOpen} />
            </Flex>

            <Link href='/'>
              <Image
                alt='dodolink-logo'
                objectFit='contain'
                borderRadius={5}
                cursor='pointer'
                height={imageNavbarSize}
                src='/Hlogo.png'
              />
            </Link>

            <Flex align='center' gap={3}>
              <NotificationButton />
              <Link as={NextLink} _hover={{ opacity: 0.65 }} href='/Profile'>
                <FaUserCircle color='white' cursor='pointer' fontSize={30} />
              </Link>
              <ColorModeSwitch />
            </Flex>
          </Flex>
        </Flex>
      )}
      {!isOnline && <LoginScreen refreshUser={refreshUser} />}
    </Box>
  );
}
