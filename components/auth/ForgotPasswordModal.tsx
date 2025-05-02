import { useResetPassword } from '@/hooks/useResetPassword';
import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

const ForgotPasswordModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, loading, email, setEmail } = useResetPassword(onClose);

  return (
    <>
      <Text
        cursor='pointer'
        _hover={{ textDecor: 'underline' }}
        fontSize={14}
        color='white'
        onClick={onOpen}
      >
        ¿Olvidaste tu contraseña?
      </Text>
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader fontSize={24}>Reestablecer contraseña</ModalHeader>
          <ModalBody>
            <Flex
              mx='auto'
              borderRadius={10}
              gap={4}
              maxW='700px'
              p={2}
              py={5}
              flexDir='column'
            >
              <Text>
                ¿Olvidaste tu contraseña? Ingresá tu email a y si coincide con
                un usuario registrado te enviaremos un mail para que puedas
                reestablecer tu contraseña.
              </Text>

              <Flex gap={5} flexDir='column'>
                <Input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderColor='#BEBEBE'
                  placeholder='Ingresar email'
                  size='sm'
                  borderRadius={5}
                  maxW='300px'
                />
                <Button
                  bg='gray.600'
                  color='white'
                  _hover={{ bg: 'gray.300', color: 'black' }}
                  size='sm'
                  w='fit-content'
                  alignSelf='center'
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Reestablecer
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
