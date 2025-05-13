import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CheckAdminRol } from '@/data/data';
import { useUser } from '@/context/userContext';
import CobrarForm from './CobraFormComps/CobrarForm';

const CargarModal = ({ size }: { initialIsPago?: boolean; size: string }) => {
  const { resetFilters, setIsPago, isPago, checkForUpdates, loadingProductos } =
    useCobrarFormContext();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const customHover = useColorModeValue(
    { bg: 'gray.700', color: 'white' },
    { bg: 'white', color: 'gray.700' }
  );
  const toast = useToast();
  if (!CheckAdminRol(user?.rol)) return <></>;
  const handleOpen = async (initialIsCompra?: boolean) => {
    await checkForUpdates();
    setIsPago(initialIsCompra ? true : false);
    onOpen();
  };
  const handleClose = () => {
    resetFilters();
    onClose();
  };

  const Pedido = () => {
    toast({
      title: 'No disponbile',
      description:
        'Opción no disponible por el momento, estamos trabajando en las actualizaciones',
      isClosable: true,
      status: 'info',
      duration: 5000,
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
      <Menu isLazy>
        <MenuButton
          as={Button}
          bg='green.700'
          color='white'
          _hover={{ opacity: 0.7 }}
          w='fit-content'
          alignSelf='center'
          size={size}
        >
          Nuevo Pedido
        </MenuButton>
        <MenuList boxShadow='0 0 2px'>
          {/* MenuItems are not rendered unless Menu is open */}
          <MenuItem p={0} w={0} h={0} />
          <MenuItem
            _hover={customHover}
            boxShadow='0 0 3px'
            justifySelf='center'
            w='95%'
            borderRadius={5}
            my={2}
            onClick={() => handleOpen(false)}
          >
            Reserva
          </MenuItem>
          <MenuItem
            _hover={customHover}
            boxShadow='0 0 3px'
            justifySelf='center'
            w='95%'
            borderRadius={5}
            my={2}
            onClick={Pedido}
          >
            Compra
          </MenuItem>
        </MenuList>
      </Menu>
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
            Nueva {isPago ? 'Orden de Compra' : 'Reserva de Pedido'}
          </ModalHeader>
          <ModalBody>
            <CobrarForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CargarModal;
