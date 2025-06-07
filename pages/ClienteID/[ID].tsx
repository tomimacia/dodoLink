import dateTexto from '@/helpers/dateTexto';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import ReactLoading from 'react-loading';
interface ClienteData {
  cliente: any;
  orders: any[];
  hostings: any[];
  productos: any[];
}

const ClientePage = () => {
  const router = useRouter();
  const { ID } = router.query;
  const { loadingColor } = useThemeColors();
  const [clientData, setClientData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const colors = {
    Active: '#779500',
    Cancelled: '#888888',
    Terminated: '#888888',
    Pending: '#cc0000',
  };
  useEffect(() => {
    if (!ID) return;

    const fetchCliente = async () => {
      try {
        const res = await fetch(`/api/sqlDB/clientID?id=${ID}`);
        if (!res.ok) throw new Error('Error al obtener datos');
        const data = await res.json();
        setClientData(data);
      } catch (error) {
        console.error('Error al obtener cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [ID]);

  const { cliente, hostings, orders, productos } = clientData || {};
  const productosConHostings = productos?.map((producto) => {
    const relacionados = hostings?.find(
      (hosting) => hosting.packageid === producto.id
    );

    return {
      ...producto,
      hosting: relacionados,
    };
  });
  if (loading) {
    return (
      <Flex maxW='700px' my={10} justify='center'>
        <ReactLoading
          type='bars'
          color={loadingColor}
          height='100px'
          width='50px'
        />
      </Flex>
    );
  }

  if (!cliente) {
    return (
      <Box p={10}>
        <Heading fontSize='xl'>Cliente no encontrado</Heading>
        <Text>El ID ingresado no corresponde a un cliente válido.</Text>
      </Box>
    );
  }

  return (
    <Box p={10}>
      {/* Datos del cliente */}
      <Box mb={8} p={6} borderRadius='xl' boxShadow='md'>
        <Flex align='center' justify='space-between'>
          <Heading size='lg'>
            {cliente?.first_name} {cliente?.last_name}
          </Heading>
          <Link
            href={`https://clientes.dodolink.com.ar/admin/clientssummary.php?userid=${cliente?.id}`}
          >
            <FiExternalLink size={18} />
          </Link>
        </Flex>
        <Text fontSize='md' color='gray.500'>
          {cliente?.email}
        </Text>
        <Text fontSize='sm' color='gray.400' mt={2}>
          Alta de usuario:{' '}
          {dateTexto(new Date(cliente?.created_at).getTime() / 1000).numDate}
        </Text>
        <Text fontSize='sm' color='gray.400'>
          Última actualización:{' '}
          {dateTexto(new Date(cliente?.updated_at).getTime() / 1000).numDate}
        </Text>
      </Box>

      {/* Servicios */}
      <Box>
        <Heading size='md' mb={4}>
          Servicios activos ({productos?.length})
        </Heading>

        {productos && productos?.length > 0 ? (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            {productosConHostings?.map((prod) => (
              <GridItem
                key={prod?.id}
                p={4}
                borderRadius='lg'
                boxShadow='sm'
                border='1px solid'
                borderLeft='5px solid'
                borderColor={
                  colors[prod?.hosting?.domainstatus as keyof typeof colors] ||
                  'gray.300'
                }
              >
                <Flex align='center' justify='space-between' mb={2}>
                  <Text fontWeight='bold'>{prod?.name}</Text>
                  <Link
                    href={`https://clientes.dodolink.com.ar/admin/clientsservices.php?userid=${cliente?.id}&productselect=${prod?.id}`}
                  >
                    <FiExternalLink size={18} />
                  </Link>
                </Flex>

                <Text fontSize='sm' mb={1}>
                  {prod?.description}
                </Text>

                <Divider my={2} />

                <Text fontSize='xs' color='gray.400'>
                  Creado:{' '}
                  {
                    dateTexto(new Date(prod?.created_at).getTime() / 1000)
                      .numDate
                  }
                </Text>
                <Text fontSize='xs' color='gray.400'>
                  Actualizado:{' '}
                  {
                    dateTexto(new Date(prod?.updated_at).getTime() / 1000)
                      .numDate
                  }
                </Text>
                {prod?.slug && (
                  <Text fontSize='xs' mt={1} color='gray.400'>
                    Slug: {prod?.slug}
                  </Text>
                )}
                {prod?.hosting?.domainstatus && (
                  <Text fontSize='sm' mt={2} fontWeight='medium'>
                    Status:{' '}
                    <Text
                      as='span'
                      fontWeight='normal'
                      color={
                        colors[
                          prod?.hosting?.domainstatus as keyof typeof colors
                        ] || 'gray.400'
                      }
                    >
                      {prod?.hosting?.domainstatus}
                    </Text>
                  </Text>
                )}
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text>No hay servicios registrados.</Text>
        )}
      </Box>
    </Box>
  );
};

export default ClientePage;
