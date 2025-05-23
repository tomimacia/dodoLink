import { FormProvider } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import CobrarForm from './CobrarForm';

const CargarModal = ({ size }: { size: string }) => {
  const [isPago, setIsPago] = useState(false);
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const customHover = useColorModeValue(
    { bg: 'gray.700', color: 'white' },
    { bg: 'white', color: 'gray.700' }
  );
  if (!CheckAdminRol(user?.rol)) return <></>;
  const handleOpen = async (initialIsCompra?: boolean) => {
    setIsPago(initialIsCompra ? true : false);
    setTimeout(() => {
      onOpen();
    }, 100);
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <Flex>
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
            onClick={() => handleOpen(true)}
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
        <FormProvider>
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
            <ModalHeader textAlign='center' p={3}>
              Nueva {isPago ? 'Orden de Compra' : 'Reserva de Pedido'}
            </ModalHeader>
            <ModalBody>
              <CobrarForm isPago={isPago} onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </FormProvider>
      </Modal>
    </Flex>
  );
};

export default CargarModal;
