import { RolType, UserType } from '@/types/types';
import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const EditUserRol = ({
  updateRolYCuadrilla,
  user,
}: {
  updateRolYCuadrilla: (
    id: string,
    rol: RolType,
    cuadrilla: number | null
  ) => Promise<void>;
  user: UserType;
}) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRol, setSelectedRol] = useState<RolType>(user.rol);
  const [cuadrilla, setCuadrilla] = useState<number | null>(user.cuadrilla);
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateRolYCuadrilla(user.id, selectedRol, cuadrilla);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex>
      <EditIcon
        onClick={onOpen}
        _hover={{ opacity: 0.7 }}
        w='fit-content'
        alignSelf='center'
        cursor='pointer'
      />

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
          <ModalHeader>
            <Heading fontSize='xl'>Editar Usuario</Heading>
          </ModalHeader>
          <ModalBody>
            <Flex py={5} gap={3} flexDir='column'>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select
                  onChange={(e) => setSelectedRol(e.target.value as RolType)}
                  name='rol'
                  required
                  borderColor='gray'
                  size='sm'
                  maxW='200px'
                  borderRadius='5px'
                  value={selectedRol}
                >
                  <option value='Superadmin'>Superadmin</option>
                  <option value='Supervisor'>Supervisor</option>
                  <option value='Admin'>Admin</option>
                  <option value='Cuadrilla'>Cuadrilla</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Cuadrilla</FormLabel>
                <Input
                  value={cuadrilla || ''}
                  onChange={(e) => setCuadrilla(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (
                      ['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e: any) => e.target.blur()}
                  placeholder='Nro de cuadrilla'
                  borderColor='gray'
                  type='email'
                  size='sm'
                  maxW='200px'
                  borderRadius='5px'
                  autoComplete='new-edit-cuadrilla'
                />
              </FormControl>

              <Button
                w='fit-content'
                bg='blue.700'
                color='white'
                size='sm'
                _hover={{ opacity: 0.65 }}
                isLoading={loading}
                onClick={handleConfirm}
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

export default EditUserRol;
