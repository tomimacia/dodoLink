import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

const DeleteModal = ({
  nombre,
  title,
  DeleteProp,
  loadingForm,
  textContent,
  size,
  isIcon,
}: {
  nombre?: string;
  title: string;
  loadingForm: boolean;
  DeleteProp: () => Promise<void>;
  textContent: any;
  size: any;
  isIcon?: boolean;
}) => {
  const fontColor = useColorModeValue('red.700', 'red.600');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    try {
      await DeleteProp();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Flex>
      {isIcon ? (
        <DeleteIcon
          aria-label='icon-delete-button'
          onClick={onOpen}
          cursor='pointer'
          _hover={{ opacity: 0.65 }}
        />
      ) : (
        <Button
          onClick={onOpen}
          bg='red.700'
          color='white'
          _hover={{ opacity: 0.7 }}
          alignSelf='center'
          size={size}
        >
          {textContent}
        </Button>
      )}

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
          <ModalHeader p={3}>Eliminar {title}</ModalHeader>
          <ModalBody>
            <Text>
              ¿Quieres eliminar el {title.toLowerCase()}
              {nombre ? <strong> {nombre}</strong> : ''}?
            </Text>
            <Flex p={5} flexDir='column' gap={3}>
              <Button
                type='submit'
                mx='auto'
                w='50%'
                fontWeight='bold'
                size='sm'
                maxW='200px'
                mt={5}
                bg={fontColor}
                color='white'
                border='1px solid transparent'
                _hover={{ opacity: 0.7, border: '1px solid gray' }}
                isLoading={loadingForm}
                onClick={handleDelete}
              >
                Confirmar
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default DeleteModal;
