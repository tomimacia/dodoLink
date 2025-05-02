import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import MotionButton from '../MotionButton';

const ModalTest = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, loading] = useAuthState(auth);
  const { push } = useRouter();

  const signOutUser = async () => {
    await signOut(auth);
    setTimeout(() => {
      onClose();
      push('/');
    }, 500);
  };
  return (
    <>
      <MotionButton>
        <Button
          _hover={{ opacity: 0.7 }}
          onClick={onOpen}
          size={['xs', 'xs', 'sm', 'sm']}
          bg='gray.600'
          color='white'
        >
          Cerrar Sesión
        </Button>
      </MotionButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>Cerrar sesión</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            pb={6}
          >
            <Flex direction='column' align='center' justify='center' w='70%'>
              <Box>
                <Text>Estas seguro que quieres cerrar?</Text>

                <Button
                  isLoading={loading}
                  onClick={signOutUser}
                  bg='gray.600'
                  color='white'
                  mt={10}
                  w='100%'
                  _hover={{ opacity: 0.7 }}
                >
                  Cerrar sesión
                </Button>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalTest;
