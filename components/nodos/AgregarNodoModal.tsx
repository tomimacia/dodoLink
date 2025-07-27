import { TiposDeEquipo } from '@/data/data';
import { EquipoType, TipoEquipo } from '@/types/types';
import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

const AgregarNodoModal = ({
  AgregarNodo,
}: {
  AgregarNodo: (newNodo: EquipoType) => void;
}) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTIpo] = useState<TipoEquipo>('Otro');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const handleAgregar = async () => {
    if (!nombre) return;
    try {
      const nuevo: EquipoType = {
        id: crypto.randomUUID(),
        nombre,
        tipo,
        coordenadas: { x: 0, y: 0 },
      };
      AgregarNodo(nuevo);
      setNombre('');
      setTIpo('Otro');
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setNombre('');
    setTIpo('Otro');
    onClose();
  };
  return (
    <Flex>
      <Button
        size='sm'
        colorScheme='blue'
        w='fit-content'
        leftIcon={<PlusSquareIcon />}
        onClick={onOpen}
      >
        Agregar Equipo
      </Button>

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
          <ModalHeader p={3}>Agregar Nodo</ModalHeader>
          <ModalBody>
            <Flex gap={2} w='100%'>
              <Input
                placeholder='Nombre'
                size='sm'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <Select
                size='sm'
                placeholder='Tipo'
                value={tipo}
                onChange={(e) => setTIpo(e.target.value as TipoEquipo)}
              >
                {TiposDeEquipo.map((t) => {
                  return (
                    <option key={`tipo-equipo-list-key-${t}`} value={t}>
                      {t}
                    </option>
                  );
                })}
              </Select>
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

export default AgregarNodoModal;
