import {
  Flex,
  Image,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Button,
  Box,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';

interface PedidoImagesProps {
  imagenes?: { id: string; url: string }[];
  onDelete: (id: string) => Promise<void>; // 🔹 callback para eliminar
}

const PedidoImages = ({ imagenes, onDelete }: PedidoImagesProps) => {
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleClick = (url: string) => {
    setSelectedImage(url);
    onImageOpen();
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    onConfirmOpen();
  };
  const toast = useToast();
  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      if (imageToDelete) {
        await onDelete(imageToDelete);
        toast({
          title: 'Éxito',
          description: 'Imagen eliminada correctamente',
          isClosable: true,
          duration: 5000,
          status: 'info',
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setImageToDelete(null);
      onConfirmClose();
      setLoadingDelete(false);
    }
  };

  if (!imagenes || imagenes.length === 0) {
    return (
      <Flex fontSize='sm' color='gray.500'>
        No hay imágenes cargadas para este pedido.
      </Flex>
    );
  }

  return (
    <>
      <Flex gap={3} flexWrap='wrap'>
        {imagenes.map((img) => (
          <Box
            key={img.id}
            position='relative'
            display='inline-block'
            cursor='zoom-in'
          >
            {/* Imagen */}
            <Image
              src={img.url}
              alt={`Imagen ${img.id}`}
              objectFit='cover'
              boxSize={{ base: '100px', sm: '120px', md: '150px' }}
              borderRadius='md'
              border='1px solid rgba(0,0,0,0.1)'
              transition='transform 0.2s'
              _hover={{ transform: 'scale(1.02)' }}
              onClick={() => handleClick(img.url)}
            />

            {/* Botón eliminar */}

            <IconButton
              aria-label='Eliminar imagen'
              icon={<CloseIcon />}
              size='xs'
              colorScheme='red'
              position='absolute'
              top='5px'
              right='5px'
              borderRadius='full'
              onClick={(e) => {
                e.stopPropagation(); // evita abrir modal de zoom
                handleDeleteClick(img.id);
              }}
            />
          </Box>
        ))}
      </Flex>

      {/* Modal para imagen expandida */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size='xl' isCentered>
        <ModalOverlay bg='blackAlpha.800' />
        <ModalContent bg='transparent' boxShadow='none'>
          <ModalBody p={0}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt='Imagen expandida'
                w='100%'
                h='auto'
                borderRadius='md'
                maxH='80vh'
                objectFit='contain'
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación de borrado */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar imagen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro que deseas eliminar esta imagen? Esta acción no se
            puede deshacer.
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={loadingDelete}
              variant='ghost'
              mr={3}
              onClick={onConfirmClose}
            >
              Cancelar
            </Button>
            <Button
              isDisabled={loadingDelete}
              isLoading={loadingDelete}
              colorScheme='red'
              onClick={confirmDelete}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PedidoImages;
