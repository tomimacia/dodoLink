import { PedidoType } from '@/types/types';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

const ConfirmarPedidoModal = ({
  loading,
  update,
  pedido,
}: {
  loading: boolean;
  update: () => Promise<void>;
  pedido: PedidoType;
}) => {
  const fontColor = useColorModeValue('red.700', 'red.600');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleUpdate = async () => {
    await update();
    onClose();   
  };
  return (
    <Flex>
      <Button
        bg='blue.700'
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        onClick={onOpen}
        isLoading={false}
      >
        Confirmar
      </Button>

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
          <ModalHeader p={3}>Pedido {pedido.id}</ModalHeader>
          <ModalBody>
            <Text>Confirmar el pedido</Text>
          </ModalBody>
          <ModalFooter>
            <Flex justify='center' gap={4} w='100%'>
              <Button
                bg='blue.700'
                color='white'
                w='fit-content'
                _hover={{ opacity: 0.65 }}
                onClick={handleUpdate}
                isLoading={loading}
              >
                Confirmar
              </Button>
              <Button
                bg={fontColor}
                color='white'
                w='fit-content'
                _hover={{ opacity: 0.65 }}
                onClick={onClose}
              >
                Cancelar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ConfirmarPedidoModal;
