import ClientIDCard from '@/components/clientes/ClientIDCard';
import dateTexto from '@/helpers/dateTexto';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';

interface ClienteData {
  cliente: any;
  orders: any[];
  hostings: any[];
  productos: any[];
}

interface Props {
  clientData: ClienteData | null;
}

const ClientePage = ({ clientData }: Props) => {
  if (!clientData?.cliente) {
    return (
      <Box p={10}>
        <Heading fontSize='xl'>Cliente no encontrado</Heading>
        <Text>El ID ingresado no corresponde a un cliente válido.</Text>
      </Box>
    );
  }

  const { cliente, hostings, productos } = clientData;
  const productosConHostings = productos.map((producto) => {
    const relacionados = hostings.find(
      (hosting) => hosting.packageid === producto.id
    );

    return {
      ...producto,
      hosting: relacionados,
    };
  });

  return (
    <Box p={10}>
      {/* Datos del cliente */}
      <Box mb={8} p={6} borderRadius='xl' boxShadow='md'>
        <Flex align='center' justify='space-between'>
          <Heading size='lg'>
            {cliente.first_name} {cliente.last_name}
          </Heading>
          <Link
            href={`https://clientes.dodolink.com.ar/admin/clientssummary.php?userid=${cliente.id}`}
          >
            <FiExternalLink size={18} />
          </Link>
        </Flex>
        <Text fontSize='md' color='gray.500'>
          {cliente.email}
        </Text>
        <Text fontSize='sm' color='gray.400' mt={2}>
          Alta de usuario:{' '}
          {dateTexto(new Date(cliente.created_at).getTime() / 1000).numDate}
        </Text>
        <Text fontSize='sm' color='gray.400'>
          Última actualización:{' '}
          {dateTexto(new Date(cliente.updated_at).getTime() / 1000).numDate}
        </Text>
      </Box>

      {/* Servicios */}
      <Box>
        <Heading size='md' mb={4}>
          Servicios ({productos.length})
        </Heading>

        {productos.length > 0 ? (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            {productosConHostings.map((prod) => (
              <ClientIDCard key={prod.id} prod={prod} clientID={cliente?.id} />
            ))}
          </Grid>
        ) : (
          <Text>No hay servicios registrados.</Text>
        )}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ID } = context.query;

  if (!ID) {
    return { props: { clientData: null } };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CURRENT_URL}api/sqlDB/clientID?id=${ID}`
    );
    if (!res.ok) throw new Error('Error al obtener datos del cliente');

    const data = await res.json();
    return {
      props: {
        clientData: data,
      },
    };
  } catch (error) {
    console.error('Error en getServerSideProps:', error);
    return { props: { clientData: null } };
  }
};

export default ClientePage;
