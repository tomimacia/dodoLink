import { VLANType } from '@/types/types';
import { PlusSquareIcon } from '@chakra-ui/icons';
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

const AgregarVlanModal = ({
  AgregarVlan,
}: {
  AgregarVlan: (newVlan: VLANType) => boolean;
}) => {
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const handleAgregar = async () => {
    if (!nombre) return;
    const nuevaVlan = {
      id: crypto.randomUUID(),
      nombre,
      description,
    };
    try {
      const agregada = AgregarVlan(nuevaVlan);
      if (agregada) {
        setNombre('');
        setDescription([]);
        onClose();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setNombre('');
    setDescription([]);
    onClose();
  };
  return (
    <Flex>
      <IconButton
        aria-label='plus-vlan-icon'
        icon={<PlusSquareIcon />}
        onClick={onOpen}
        size='sm'
        variant='outline'
        colorScheme='blue'
      />
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader p={3}>Agregar VLAN</ModalHeader>
          <ModalBody>
            <Input
              placeholder='Nombre VLAN'
              size='sm'
              mb={2}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Textarea
              placeholder='Descripción'
              size='sm'
              mb={2}
              value={description.join('\n')}
              onChange={(e) => setDescription(e.target.value.split('\n'))}
            />
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
                isLoading={loading}
                isDisabled={loading}
                size='sm'
                onClick={handleAgregar}
                colorScheme='blue'
              >
                Guardar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AgregarVlanModal;
