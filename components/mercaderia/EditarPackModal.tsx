import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditarPackModal = ({
  initialPack,
  editPack,
}: {
  initialPack: string;
  editPack: (newPack: string) => Promise<void>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pack, setPack] = useState(initialPack);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!pack) {
      toast({
        title: 'Error',
        description: 'Ingresá un valor para confirmar',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (pack === initialPack) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un nombre nuevo',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      await editPack(pack);
      toast({
        title: 'Actualizado',
        description: `Pack ${pack} actualizado con éxito`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Error actualizando pack, intenta nuevamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }

    console.log(pack);
  };
  const toast = useToast();
  const handleOpen = () => {
    if (!initialPack) {
      toast({
        title: 'Error',
        description: 'Seleccioná un pack para editar',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };
  const handleClose = () => {
    setPack(initialPack);
    onClose();
  };
  return (
    <>
      <IconButton
        icon={<EditIcon />}
        size='sm'
        variant='outline'
        aria-label={`editar-pack-button`}
        onClick={handleOpen}
      />

      <Modal
        size='lg'
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius='lg'>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.300' }}
            bg='blackAlpha.100'
          />
          <ModalHeader fontSize='xl' fontWeight='bold'>
            Editar Pack
          </ModalHeader>

          <ModalBody>
            <Flex direction='column' gap={5} p={2} px={[0, 2, 4]} maxW='100%'>
              <Text>Ingresá el nuevo nombre del pack:</Text>

              <Input
                required
                value={pack}
                onChange={(e) => setPack(e.target.value)}
                placeholder='Nuevo pack...'
                size='md'
                borderRadius='md'
                maxW='100%'
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex justify='flex-end' mt={4} gap={3}>
              <Button
                isDisabled={loading}
                size='sm'
                onClick={handleClose}
                variant='ghost'
              >
                Cancelar
              </Button>
              <Button
                isDisabled={loading}
                isLoading={loading}
                size='sm'
                onClick={handleSubmit}
                colorScheme='blue'
              >
                Guardar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditarPackModal;
