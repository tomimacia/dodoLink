import { useResetPassword } from '@/hooks/useResetPassword';
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';

const ForgotPasswordModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, loading, email, setEmail } = useResetPassword(onClose);

  const inputBorderColor = useColorModeValue('#CBD5E0', '#4A5568');
  const inputBg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Text
        cursor="pointer"
        _hover={{ textDecor: 'underline' }}
        fontSize="14px"
        color="whiteAlpha.800"
        onClick={onOpen}
      >
        ¿Olvidaste tu contraseña?
      </Text>

      <Modal
        size="lg"
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent p={4} borderRadius="lg">
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.300' }}
            bg="blackAlpha.100"
          />
          <ModalHeader fontSize="xl" fontWeight="bold">
            Reestablecer contraseña
          </ModalHeader>

          <ModalBody>
            <Flex
              direction="column"
              gap={5}
              p={2}
              px={[0, 2, 4]}
              maxW="100%"
              align="center"
            >
              <Text fontSize="sm" color="gray.600">
                Ingresá tu email y te enviaremos un enlace para reestablecer tu
                contraseña si el usuario existe en el sistema.
              </Text>

              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                size="md"
                bg={inputBg}
                borderColor={inputBorderColor}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                borderRadius="md"
                maxW="100%"
              />

              <Button
                colorScheme="blue"
                size="md"
                onClick={handleSubmit}
                isLoading={loading}
                alignSelf="center"
                w="100%"
                maxW="200px"
              >
                Enviar enlace
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
