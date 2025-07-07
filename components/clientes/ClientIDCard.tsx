import { statusColors } from '@/data/data';
import dateTexto from '@/helpers/dateTexto';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiExternalLink } from 'react-icons/fi';
const ClientIDCard = ({ prod, clientID }: { prod: any; clientID: string }) => {
  const router = useRouter();
  const color =
    statusColors[prod.hosting?.domainstatus as keyof typeof statusColors] ||
    'gray';
  return (
    <motion.div
      key={prod.id}
      style={{
        padding: 16,
        borderRadius: '15px',
        border: '1px solid',
        borderLeft: '5px solid',
        borderColor: color,
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.02, boxShadow: `0px 0 1px ${color}` }}
      transition={{ duration: 0.2, type: 'tween' }}
      onClick={() => router.push(`/ServicioID/${prod.id}`)}
    >
      <Flex align='center' justify='space-between' mb={2}>
        <Text fontWeight='bold'>{prod.name}</Text>
        <Link
          onClick={(e) => e.stopPropagation()}
          href={`https://clientes.dodolink.com.ar/admin/clientsservices.php?userid=${clientID}&productselect=${prod.id}`}
        >
          <FiExternalLink size={18} />
        </Link>
      </Flex>

      <Text fontSize='sm' mb={1}>
        {prod.description}
      </Text>

      <Divider my={2} />

      <Text fontSize='xs' color='gray.400'>
        Creado: {dateTexto(new Date(prod.created_at).getTime() / 1000).numDate}
      </Text>
      <Text fontSize='xs' color='gray.400'>
        Actualizado:{' '}
        {dateTexto(new Date(prod.updated_at).getTime() / 1000).numDate}
      </Text>
      {prod.slug && (
        <Text fontSize='xs' mt={1} color='gray.400'>
          Slug: {prod.slug}
        </Text>
      )}
      {prod.hosting?.domainstatus && (
        <Text fontSize='sm' mt={2} fontWeight='medium'>
          Status:{' '}
          <Text
            as='span'
            fontWeight='normal'
            color={
              statusColors[
                prod.hosting?.domainstatus as keyof typeof statusColors
              ] || 'gray.400'
            }
          >
            {prod.hosting?.domainstatus}
          </Text>
        </Text>
      )}
    </motion.div>
  );
};

export default ClientIDCard;
