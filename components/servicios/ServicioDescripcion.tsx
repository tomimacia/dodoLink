import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ServicioFirebaseType } from '@/types/types';
import {
  Button,
  Collapse,
  Flex,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react';
const ServicioDescripcion = ({
  servicio,
  setShouldUpdate,
  updateServicio,
  setServicio,
}: {
  servicio: ServicioFirebaseType;
  setShouldUpdate: Dispatch<SetStateAction<boolean>>;
  updateServicio: (id: string, servicio: ServicioFirebaseType) => Promise<void>;
  setServicio: Dispatch<SetStateAction<ServicioFirebaseType>>;
}) => {
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [inputDescription, setInputDescription] = useState<string | null>(
    servicio?.description?.join('\n') || ''
  );
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const inputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const customGray = useColorModeValue('gray.700', 'gray.300');
  const asignarDescription = async () => {
    if (!inputDescription) {
      toast({
        title: 'Descripción requerida',
        description: 'Por favor, ingresá una descripción.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (inputDescription === servicio.description?.join('\n')) {
      toast({
        title: 'Descripción ya asignada',
        description:
          'La descripción ingresada es igual a a la anterior, modificala.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoadingDescription(true);
    try {
      // Guardar en Firebase
      const newDescription = inputDescription.split('\n');
      await setSingleDoc('servicios', servicio.id, {
        description: newDescription,
      });
      await updateServicio(servicio.id, {
        ...servicio,
        description: newDescription,
      });
      setServicio((prev) => ({
        ...prev,
        description: newDescription,
      }));

      toast({
        title: 'Éxito',
        description: 'Descripción asignada correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error al asignar descripción:', err);
      toast({
        title: 'Error al asignar descripción',
        description: 'Ocurrió un error con el proceso, probá nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingDescription(false);
      onToggle();
    }
  };
  return (
    <Stack borderRadius='md' boxShadow='md' p={2} my={6} spacing={1}>
      <Text fontWeight='medium' color={customGray}>
        Descripción:
      </Text>
      <Flex fontSize='sm' flexDir='column'>
        {servicio?.description ? (
          servicio?.description?.map((l) => {
            return (
              <Fragment key={`${l}-description-${servicio?.id}}`}>
                {l ? <span>{l}</span> : <br />}
              </Fragment>
            );
          })
        ) : (
          <Text fontStyle='italic'>No hay descripción</Text>
        )}
      </Flex>
      <Flex mt={2} direction='column' gap={2}>
        <Button
          size='sm'
          onClick={() => {
            onToggle();
            setShouldUpdate(true);
            setTimeout(() => {
              inputDescriptionRef.current?.focus();
            }, 150);
          }}
          variant='outline'
          colorScheme='blue'
          alignSelf='flex-start'
        >
          {isOpen ? 'Cerrar edición' : 'Editar descripción'}
        </Button>

        <Collapse in={isOpen} animateOpacity>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              asignarDescription();
            }}
          >
            <Flex
              mt={2}
              gap={3}
              align='center'
              flexWrap='wrap'
              p={3}
              border='1px solid'
              borderColor='gray.200'
              borderRadius='md'
              background='gray.50'
            >
              <Textarea
                ref={inputDescriptionRef}
                placeholder='Ingresar una descripción'
                size='sm'
                h={100}
                borderRadius='md'
                value={inputDescription || ''}
                onChange={(e) => setInputDescription(e.target.value)}
              />
              <Button
                size='sm'
                colorScheme='blue'
                isLoading={loadingDescription}
                loadingText='Actualizando'
                type='submit'
              >
                Confirmar
              </Button>
              <Button
                size='sm'
                colorScheme='red'
                variant='outline'
                onClick={onToggle}
              >
                Cancelar
              </Button>
            </Flex>
          </form>
        </Collapse>
      </Flex>
    </Stack>
  );
};

export default ServicioDescripcion;
