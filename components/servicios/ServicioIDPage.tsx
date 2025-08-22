import NotFoundPage from '@/components/NotFoundPage';
import { statusColors } from '@/data/data';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import useGetServicios from '@/hooks/data/useGetServicios';
import { ServicioFirebaseType } from '@/types/types';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AgregarGraphId from './AgregarGraphId';
import GraphIdComp from './GraphIdComp';
import MainServiceData from './MainServiceData';
import ServicioDescripcion from './ServicioDescripcion';
import { FiExternalLink } from 'react-icons/fi';

const ServicioIDPage = ({
  producto,
  graphImage,
  productoFirebase,
}: {
  producto: any;
  graphImage: string[];
  productoFirebase: ServicioFirebaseType;
}) => {
  const [currentProductoFirebase, setCurrentProductoFirebase] =
    useState(productoFirebase);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const { updateServicio } = useGetServicios(shouldUpdate);
  const router = useRouter();
  const toast = useToast();
  const customGray = useColorModeValue('gray.700', 'gray.300');

  const [graphImageState, setGraphImageState] = useState<string[]>(graphImage);

  if (!producto)
    return (
      <NotFoundPage
        content='El producto que buscás no existe o fue eliminado.'
        title='Producto no encontrado'
      />
    );

  const { name, description, created_at, updated_at, id, slug } =
    producto.producto;

  const status = producto.hostings[0]?.domainstatus || null;
  const isCancelled = status === 'Cancelled' || status === 'Terminated';
  const color = statusColors[status as keyof typeof statusColors] || 'gray';

  const eliminarGraphId = async (graphToRemove: string) => {
    const newGraphIds = currentProductoFirebase.graphId.filter(
      (g) => g !== graphToRemove
    );

    await setSingleDoc('servicios', currentProductoFirebase.id, {
      ...currentProductoFirebase,
      graphId: newGraphIds,
    });

    setCurrentProductoFirebase((prev) => ({
      ...prev,
      graphId: newGraphIds,
    }));

    // Actualizar imágenes
    const newGraphImages = graphImageState.filter(
      (_, idx) => currentProductoFirebase.graphId[idx] !== graphToRemove
    );
    setGraphImageState(newGraphImages);
  };
  return (
    <Flex mt={4} flexDir='column' gap={4} flex={1}>
      <Flex justify='space-between' px={2} gap={2}>
        <Heading size='md' mb={1}>
          {name}
        </Heading>
        <Button
          onClick={() => router.back()}
          size='sm'
          variant='link'
          colorScheme='gray'
          leftIcon={<FiExternalLink size={14} />}
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

        <MainServiceData producto={producto.producto} />

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
        <ServicioDescripcion
          servicio={currentProductoFirebase}
          setServicio={setCurrentProductoFirebase}
          setShouldUpdate={setShouldUpdate}
          updateServicio={updateServicio}
        />
        {/* Gráfico de monitoreo */}
        <Box mt={10}>
          <Heading size='sm' my={2}>
            Gráficos de monitoreo (Zabbix)
          </Heading>

          <Flex direction='column' gap={4} my={4}>
            {graphImageState.length > 0 &&
              graphImageState.map((img, index) => {
                const graphId = currentProductoFirebase.graphId[index];
                return (
                  <GraphIdComp
                    color={color}
                    img={img}
                    graphId={graphId}
                    eliminarGraphId={eliminarGraphId}
                    key={graphId}
                  />
                );
              })}
            {graphImageState.length === 0 && (
              <Text fontSize='sm' fontStyle='italic'>
                No hay gráficos asignados
              </Text>
            )}
          </Flex>

          {/* Form para agregar nuevo ID */}
        </Box>
      </Box>
      <AgregarGraphId
        servicio={currentProductoFirebase}
        setServicio={setCurrentProductoFirebase}
        setGraphImageState={setGraphImageState}
      />
    </Flex>
  );
};

export default ServicioIDPage;

