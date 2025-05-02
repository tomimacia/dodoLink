import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import CobrarForm from './CobrarForm';

const CargarModal = ({
  initialIsPago,
  size,
  getNewClient,
}: {
  initialIsPago?: boolean;
  size: string;
  getNewClient?: () => Promise<void>;
}) => {
  const { resetFilters, setIsPago, checkForUpdates, loadingProductos } =
    useCobrarFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleOpen = async () => {
    await checkForUpdates();
    setIsPago(initialIsPago ? true : false);
    onOpen();
  };
  const handleClose = () => {
    resetFilters();
    onClose();
  };
  const handleOpenDev = () => {
    toast({
      title: 'Próximamente',
      description: 'Estamos trabajando en las actualizaciones',
      isClosable: true,
      duration: 5000,
      status: 'info',
    });
  };
  return (
    <Flex>
      {loadingProductos && (
        <Flex pos='absolute' top={2} left={0} w='100vw' h='5px' zIndex={20000}>
          <Progress
            h='100%'
            colorScheme='blue'
            bg='transparent'
            w='100%'
            isIndeterminate
          />
        </Flex>
      )}

      {!initialIsPago && (
        <Button
          onClick={handleOpenDev}
          bg='green.700'
          color='white'
          _hover={{ opacity: 0.7 }}
          w='fit-content'
          alignSelf='center'
          my={2}
          size={size}
        >
          Nueva Reserva
        </Button>
      )}
      {initialIsPago && (
        <Button
          onClick={handleOpenDev}
          bg='gray.600'
          color='white'
          _hover={{ opacity: 0.7 }}
          w='fit-content'
          alignSelf='center'
          my={2}
          size={size}
        >
          Nueva Compra
        </Button>
      )}
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        motionPreset='slideInBottom'
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent
          position='fixed'
          top='5vh' // Mantiene el modal anclado en esta posición
          minH='60vh'
          maxH='90vh' // Limita la altura máxima antes de activar el scroll interno
          overflow='hidden' // Evita que el modal se agrande más de lo deseado
          overflowY='auto'
        >
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader p={3}>
            Nueva {initialIsPago ? 'Orden de Compra' : 'Reserva de Pedido'}
          </ModalHeader>
          <ModalBody>
            <CobrarForm getNewClient={getNewClient} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CargarModal;
