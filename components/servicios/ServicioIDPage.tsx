import NotFoundPage from '@/components/NotFoundPage';
import { statusColors } from '@/data/data';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { getDateRangeFromLapso } from '@/helpers/getDateFrangeFromLapso';
import useGetServicios from '@/hooks/data/useGetServicios';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Fragment, useRef, useState } from 'react';
import EliminarGraphIdModal from './EliminarGraphIdModal';

type ProductoFirebaseType = {
  id: string;
  graphId: string | null;
  description?: string[];
};

const ServicioIDPage = ({
  producto,
  graphImage,
  productoFirebase,
}: {
  producto: any;
  graphImage: string | null;
  productoFirebase: ProductoFirebaseType;
}) => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const { updateServicio } = useGetServicios(shouldUpdate);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenDescription, onToggle: onToggleDescription } =
    useDisclosure();
  const [currentProductoFirebase, setCurrentProductoFirebase] =
    useState(productoFirebase);
  const customGray = useColorModeValue('gray.700', 'gray.300');
  const [lapso, setLapso] = useState('1h');
  const inputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const inputGraphIdRef = useRef<HTMLInputElement | null>(null);
  const [inputGraphId, setInputGraphId] = useState('');
  const [inputDescription, setInputDescription] = useState<string | null>(
    currentProductoFirebase?.description?.join('\n') || ''
  );
  const [graphImageState, setGraphImageState] = useState(graphImage);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);

  if (!producto)
    return (
      <NotFoundPage
        content='El producto que buscás no existe o fue eliminado.'
        title='Producto no encontrado'
      />
    );

  const {
    name,
    description,
    type,
    paytype,
    proratabilling,
    is_featured,
    hidden,
    created_at,
    updated_at,
    id,
    slug,
  } = producto.producto;

  const status = producto.hostings[0]?.domainstatus || null;
  const isCancelled = status === 'Cancelled' || status === 'Terminated';
  const color = statusColors[status as keyof typeof statusColors] || 'gray';

  const actualizarGraphImage = async (newLapso: string) => {
    setLoadingGraph(true);
    try {
      const { from, to } = getDateRangeFromLapso(newLapso);
      // Llamada a la API para obtener el gráfico
      const res = await axios.post('/api/zabbix/graph', {
        graphid: currentProductoFirebase.graphId,
        from,
        to,
      });

      // Actualizar el estado del gráfico con la nueva imagen
      setGraphImageState(res.data.imageBase64);
    } catch (err) {
      console.error('Error al actualizar gráfico:', err);
    } finally {
      setLoadingGraph(false);
    }
  };
  const asignarGraphId = async () => {
    if (!inputGraphId) {
      toast({
        title: 'ID de gráfico requerido',
        description: 'Por favor, ingresá un ID de gráfico válido.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (inputGraphId === currentProductoFirebase.graphId) {
      toast({
        title: 'ID de gráfico ya asignado',
        description: 'El ID ingresado ya está asignado a este producto.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoadingGraph(true);
    try {
      // Obtener imagen desde la API
      const { from, to } = getDateRangeFromLapso(lapso);
      const res = await axios.post('/api/zabbix/graph', {
        graphid: inputGraphId,
        from,
        to,
      });
      // Guardar en Firebase
      await setSingleDoc('servicios', currentProductoFirebase.id, {
        ...currentProductoFirebase,
        graphId: inputGraphId,
      });
      setGraphImageState(res.data.imageBase64);
      setCurrentProductoFirebase((prev) => ({
        ...prev,
        graphId: inputGraphId,
      }));

      toast({
        title: 'Gráfico asignado',
        description: 'Gráfico asignado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error al asignar gráfico:', err);
      toast({
        title: 'Error al asignar gráfico',
        description: 'Ocurrió un error con el ID ingresado, probá nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingGraph(false);
      onToggle();
    }
  };
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
    if (inputDescription === currentProductoFirebase.description?.join('\n')) {
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
      await setSingleDoc('servicios', currentProductoFirebase.id, {
        description: newDescription,
      });
      await updateServicio(currentProductoFirebase.id, {
        ...currentProductoFirebase,
        description: newDescription,
      });
      setCurrentProductoFirebase((prev) => ({
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
      onToggleDescription();
    }
  };
  const eliminarGraphId = async () => {
    try {
      await setSingleDoc('servicios', currentProductoFirebase.id, {
        ...currentProductoFirebase,
        graphId: null,
      });
      setGraphImageState(null);
      setCurrentProductoFirebase((prev) => ({
        ...prev,
        graphId: null,
      }));
      toast({
        title: 'Eliminado',
        description: 'Graph ID eliminado correctamente.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al eliminar graph ID.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };
  return (
    <Flex mt={4} flexDir='column' gap={4} flex={1}>
      <Flex justify='space-between' px={2} gap={2}>
        <Heading size='md' mb={1}>
          {name}
        </Heading>
        <Button
          _active={{ bg: 'transparent' }}
          variant='link'
          onClick={() => router.back()}
          size='sm'
        >
          Volver
        </Button>
      </Flex>

      <Box
        mx='auto'
        p={6}
        w='100%'
        borderWidth={1}
        borderRadius='md'
        borderLeft='6px solid'
        borderColor={color || 'gray.300'}
        boxShadow='sm'
        opacity={isCancelled ? 0.7 : 1}
        filter={isCancelled ? 'grayscale(75%)' : 'none'}
        pointerEvents={isCancelled ? 'none' : 'auto'}
      >
        <Text fontSize='sm' color={customGray} mb={4}>
          ID #{id}
        </Text>

        {status && (
          <Text fontSize='sm' color={customGray} mb={4}>
            Status: <b style={{ color }}>{status}</b>
          </Text>
        )}

        <Wrap mb={6} spacing={2}>
          <WrapItem>
            <Badge variant='subtle' colorScheme='blue'>
              Tipo: {type}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge variant='subtle' colorScheme='green'>
              Pago: {paytype}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge variant='subtle' colorScheme={hidden ? 'gray' : 'purple'}>
              {hidden ? 'Oculto' : 'Visible'}
            </Badge>
          </WrapItem>
          {is_featured === 1 && (
            <WrapItem>
              <Badge variant='subtle' colorScheme='pink'>
                Destacado
              </Badge>
            </WrapItem>
          )}
          {proratabilling === 1 && (
            <WrapItem>
              <Badge variant='subtle' colorScheme='yellow'>
                Prorrata
              </Badge>
            </WrapItem>
          )}
        </Wrap>

        {description && (
          <Flex flexDir='column'>
            <Text fontWeight='bold'>Descripción</Text>
            <Text p={1} fontSize='md' mb={4} lineHeight='1.6'>
              {description}
            </Text>
          </Flex>
        )}

        <Divider my={4} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Stack spacing={1}>
            <Text fontWeight='medium' color={customGray}>
              Slug:
            </Text>
            <Text>{slug || '—'}</Text>
          </Stack>

          <Stack spacing={1}>
            <Text fontWeight='medium' color={customGray}>
              Creado:
            </Text>
            <Text>{new Date(created_at).toLocaleDateString()}</Text>
          </Stack>

          <Stack spacing={1}>
            <Text fontWeight='medium' color={customGray}>
              Actualizado:
            </Text>
            <Text>{new Date(updated_at).toLocaleDateString()}</Text>
          </Stack>
        </SimpleGrid>
        <Stack borderRadius='md' boxShadow='md' p={2} my={6} spacing={1}>
          <Text fontWeight='medium' color={customGray}>
            Descripción:
          </Text>
          <Flex fontSize='sm' flexDir='column'>
            {currentProductoFirebase?.description ? (
              currentProductoFirebase?.description?.map((l) => {
                return (
                  <Fragment key={`${l}-description-${producto?.id}}`}>
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
                onToggleDescription();
                setShouldUpdate(true);
                setTimeout(() => {
                  inputDescriptionRef.current?.focus();
                }, 150);
              }}
              variant='outline'
              colorScheme='blue'
              alignSelf='flex-start'
            >
              {isOpenDescription ? 'Cerrar edición' : 'Editar descripción'}
            </Button>

            <Collapse in={isOpenDescription} animateOpacity>
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
                    onClick={onToggleDescription}
                  >
                    Cancelar
                  </Button>
                </Flex>
              </form>
            </Collapse>
          </Flex>
        </Stack>
        {/* Gráfico de monitoreo */}
        <Box mt={10}>
          <Heading size='sm' my={2}>
            Gráfico de monitoreo (Zabbix)
          </Heading>
          {currentProductoFirebase?.graphId && (
            <Text my={1} fontSize='sm' fontStyle='italic'>
              Graph ID: <b>#{currentProductoFirebase.graphId}</b>
            </Text>
          )}
          {graphImageState ? (
            <Flex flexDir='column' gap={4}>
              <Select
                my={1}
                cursor='pointer'
                size='sm'
                maxW='200px'
                value={lapso}
                onChange={(e) => {
                  setLapso(e.target.value);
                  actualizarGraphImage(e.target.value);
                }}
              >
                <option value='1h'>Última hora</option>
                <option value='4h'>Últimas 4 horas</option>
                <option value='12h'>Últimas 12 horas</option>
                <option value='1d'>Último día</option>
                <option value='2d'>Últimos 2 días</option>
                <option value='4d'>Últimos 4 días</option>
                <option value='7d'>Últimos 7 días</option>
              </Select>
              <motion.div
                key={graphImageState} // fuerza la animación cuando cambia la imagen
                initial={{ boxShadow: '0 0 0px rgba(0, 122, 255, 0)' }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${color}`,
                    `0 0 20px ${color}`,
                    `0 0 0px ${color}`,
                  ],
                }}
                transition={{ duration: 1.5 }}
              >
                <Image
                  w='100%'
                  src={graphImageState}
                  alt='Gráfico de Zabbix'
                  borderRadius='md'
                  boxShadow='md'
                />
              </motion.div>
              <Flex direction='column' gap={2}>
                <Button
                  size='sm'
                  onClick={() => {
                    onToggle();
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                      });
                      inputGraphIdRef.current?.focus();
                    }, 150); // Espera a que el colapsable se abra
                  }}
                  variant='outline'
                  colorScheme='blue'
                  alignSelf='flex-start'
                >
                  {isOpen ? 'Cerrar edición del gráfico' : 'Editar gráfico'}
                </Button>

                <Collapse in={isOpen} animateOpacity>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      asignarGraphId();
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
                      <Input
                        placeholder='Nuevo graph ID'
                        size='sm'
                        maxW='200px'
                        borderRadius='md'
                        type='number'
                        ref={inputGraphIdRef}
                        onKeyDown={(e) => {
                          if (
                            [
                              'ArrowUp',
                              'ArrowDown',
                              'e',
                              '+',
                              '-',
                              '.',
                            ].includes(e.key)
                          )
                            e.preventDefault();
                        }}
                        value={inputGraphId}
                        onChange={(e) => setInputGraphId(e.target.value)}
                      />
                      <Button
                        size='sm'
                        colorScheme='blue'
                        isLoading={loadingGraph}
                        loadingText='Actualizando'
                        type='submit'
                      >
                        Reasignar
                      </Button>
                      <EliminarGraphIdModal DeleteProp={eliminarGraphId} />
                    </Flex>
                  </form>
                </Collapse>
              </Flex>
            </Flex>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                asignarGraphId();
              }}
            >
              <Flex flexDir='column' gap={4}>
                <Input
                  placeholder='Ingresá el ID del gráfico de Zabbix'
                  size='sm'
                  maxW='300px'
                  type='number'
                  onKeyDown={(e) => {
                    if (
                      ['ArrowUp', 'ArrowDown', 'e', '+', '-', '.'].includes(
                        e.key
                      )
                    )
                      e.preventDefault();
                  }}
                  value={inputGraphId}
                  onChange={(e) => setInputGraphId(e.target.value)}
                />
                <Button
                  size='sm'
                  colorScheme='blue'
                  isLoading={loadingGraph}
                  loadingText='Asignando'
                  maxW='fit-content'
                  variant='outline'
                  type='submit'
                >
                  Asignar graph ID
                </Button>
              </Flex>
            </form>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default ServicioIDPage;
