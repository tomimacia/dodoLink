import { OpenModalType } from '@/types/types';
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
} from '@chakra-ui/react';

const DeleteDataModal = ({
  data,
  onClose,
}: {
  data: OpenModalType | null;
  onClose: () => void;
}) => {
  const { description, func, title } = data ?? {};
  const handleConfirmar = () => {
    if (!func) return;
    func();
    onClose();
  };
  return (
    <Modal
      size={['xl', '2xl', '3xl', '3xl']}
      isCentered
      blockScrollOnMount={false}
      isOpen={!!data}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          zIndex={10}
          _hover={{ bg: 'blackAlpha.400' }}
          bg='blackAlpha.200'
        />
        <ModalHeader p={3}>{title}</ModalHeader>
        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Flex justify='flex-end' mt={4} gap={3}>
            <Button size='sm' onClick={onClose} variant='ghost'>
              Cancelar
            </Button>
            <Button size='sm' onClick={handleConfirmar} colorScheme='red'>
              Confirmar
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteDataModal;
