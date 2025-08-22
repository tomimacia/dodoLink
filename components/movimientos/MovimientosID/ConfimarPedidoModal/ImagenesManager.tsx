import AddImages from '@/components/AddImages';
import { ImagenDBType, ImagenType } from '@/types/types';
import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  useToast,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import PedidoImages from '../PedidoImages';

const ImagenesManager = ({
  cargarImagenes,
  onDelete,
  dbImages,
}: {
  cargarImagenes: (newImagenes: ImagenType[]) => Promise<void>;
  dbImages: ImagenDBType[];
  onDelete: (id: string) => Promise<void>;
}) => {
  const [imagenes, setImagenes] = useState<ImagenType[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const agregarImagen = () => {
    setImagenes((prev) => [...prev, { id: crypto.randomUUID(), file: null }]);
  };

  const setImagen = (file: File | string | null, id: string) => {
    setImagenes((prev) =>
      prev.map((img) => (img.id === id ? { ...img, file } : img))
    );
  };

  const eliminarImagen = (id: string) => {
    setImagenes((prev) => prev.filter((img) => img.id !== id));
  };

  const confirm = async () => {
    const imagenesFiltered = imagenes.filter((i) => !!i.file);
    if (imagenesFiltered.length === 0) {
      toast({
        title: 'Error',
        description: 'Debes agregar al menos una imagen',
        isClosable: true,
        duration: 5000,
        status: 'warning',
      });
      return;
    }
    setLoading(true);
    try {
      await cargarImagenes(imagenes);
      setImagenes([]);
      toast({
        title: 'Éxito',
        description: 'Imágenes cargadas correctamente',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las imágenes',
        isClosable: true,
        duration: 5000,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant='outline' borderRadius='2xl' shadow='md' mt={4}>
      <CardBody>
        <Flex flexDir='column' gap={4}>
          <Heading as='h3' size='md' color='blue.600'>
            📷 Imágenes del pedido
          </Heading>

          <PedidoImages onDelete={onDelete} imagenes={dbImages} />

          <Divider />

          <Flex align='center' justify='space-between'>
            <Text
              fontWeight='semibold'
              color='gray.700'
              _dark={{ color: 'gray.200' }}
            >
              Agregar nuevas fotos
            </Text>
            <IconButton
              onClick={agregarImagen}
              aria-label='agregar-imagen'
              colorScheme='blue'
              icon={<PlusSquareIcon />}
              size='sm'
            />
          </Flex>

          <Flex gap={4} flexWrap='wrap'>
            {imagenes.map((img) => (
              <Flex
                key={img.id}
                flexDir='column'
                align='center'
                gap={2}
                p={3}
                border='1px solid'
                borderColor='gray.200'
                borderRadius='xl'
                boxShadow='sm'
                bg='gray.50'
                _dark={{ bg: 'gray.800', borderColor: 'gray.600' }}
              >
                <AddImages
                  keyData={img.id}
                  onConfirm={(file) => setImagen(file, img.id)}
                  defaultImage={img.file || ''}
                  width={160}
                  height={130}
                />
                <Button
                  onClick={() => eliminarImagen(img.id)}
                  colorScheme='red'
                  variant='outline'
                  size='xs'
                >
                  Eliminar
                </Button>
              </Flex>
            ))}
          </Flex>

          {imagenes.length > 0 && (
            <Flex justify='flex-end'>
              <Button
                onClick={confirm}
                isLoading={loading}
                isDisabled={loading}
                colorScheme='blue'
                size='sm'
              >
                Confirmar subida
              </Button>
            </Flex>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ImagenesManager;
