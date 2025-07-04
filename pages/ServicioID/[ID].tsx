import NotFoundPage from '@/components/NotFoundPage';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  SimpleGrid,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
type ServerSideProps = {
  params: {
    ID: string;
  };
};

export const getServerSideProps = async ({ params }: ServerSideProps) => {
  const { ID } = params;
  try {
    const res = await axios.get(
      `http://localhost:3000/api/sqlDB/productID?id=${ID}`
    );
    return {
      props: {
        servicio: res.data.producto || null,
      },
    };
  } catch (error) {
    console.error('Error al traer el producto:', error);
    return {
      props: {
        servicio: null,
      },
    };
  }
};

const ServicioID = ({ servicio }: { servicio: any }) => {
  if (!servicio)
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
    color,
    hidden,
    created_at,
    updated_at,
    id,
    slug,
  } = servicio;

  return (
    <Box
      maxW='800px'
      mx='auto'
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius='md'
      borderLeft='6px solid'
      borderColor={color || 'gray.300'}
      bg='white'
      boxShadow='sm'
    >
      <Heading size='md' mb={1}>
        {name}
      </Heading>

      <Text fontSize='sm' color='gray.500' mb={4}>
        ID #{id}
      </Text>

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
        <Text fontSize='md' mb={4} lineHeight='1.6'>
          {description}
        </Text>
      )}

      <Divider my={4} />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stack spacing={1}>
          <Text fontWeight='medium' color='gray.600'>
            Slug:
          </Text>
          <Text>{slug || '—'}</Text>
        </Stack>

        <Stack spacing={1}>
          <Text fontWeight='medium' color='gray.600'>
            Creado:
          </Text>
          <Text>{new Date(created_at).toLocaleDateString()}</Text>
        </Stack>

        <Stack spacing={1}>
          <Text fontWeight='medium' color='gray.600'>
            Actualizado:
          </Text>
          <Text>{new Date(updated_at).toLocaleDateString()}</Text>
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

export default ServicioID;
