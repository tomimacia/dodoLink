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
import { useState } from 'react';

const EliminarGraphIdModal = ({
  DeleteProp,
}: {
  DeleteProp: () => Promise<void>;
}) => {
  const fontColor = useColorModeValue('red.700', 'red.600');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await DeleteProp();
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex>
      <Button size='sm' colorScheme='red' variant='outline' onClick={onOpen}>
        Eliminar
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
          <ModalHeader p={3}>Eliminar GraphId</ModalHeader>
          <ModalBody>
            <Text>¿Quieres eliminar el GraphId?</Text>
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
                isLoading={loading}
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

export default EliminarGraphIdModal;
