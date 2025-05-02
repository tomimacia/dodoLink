import { ClientType } from '@/types/types';
import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import ClienteForm from './ClienteForm';

const ClienteModal = ({
  cliente,
  size,
  isIcon,
  setNewCliente,
}: {
  cliente: ClientType;
  size: any;
  isIcon?: boolean;
  setNewCliente?: (newCliente: ClientType) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex>
      {isIcon ? (
        <Button
          onClick={onOpen}
          _hover={{ opacity: 0.7 }}
          w='fit-content'
          alignSelf='center'
          my={2}
          size={size}
        >
          <EditIcon />
        </Button>
      ) : (
        <Button
          onClick={onOpen}
          _hover={{ opacity: 0.7 }}
          size={size}
          color='white'
          bg='gray.600'
        >
          Editar
        </Button>
      )}
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        motionPreset='slideInBottom'
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          position='fixed'
          top='5vh' // Mantiene el modal anclado en esta posición
          maxH='90vh' // Limita la altura máxima antes de activar el scroll interno
          overflow='hidden' // Evita que el modal se agrande más de lo deseado
          overflowY='auto'
        >
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader>Editar Cliente</ModalHeader>
          <ModalBody p={5}>
            <ClienteForm
              setNewCliente={setNewCliente}
              onClose={onClose}
              cliente={cliente}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ClienteModal;
