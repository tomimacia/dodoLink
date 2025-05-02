import useGetClientes from '@/hooks/useGetClientes';
import { ClientType } from '@/types/types';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import DeleteModal from '../DeleteModal';
import Link from 'next/link';
const ClientCard = ({
  c,
  isList,
  deleteClienteFront,
}: {
  c: ClientType;
  isList: boolean;
  deleteClienteFront: (id: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { deleteCliente } = useGetClientes();
  const toast = useToast();
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteCliente(id);
      deleteClienteFront(id);
      toast({
        status: 'success',
        title: 'Cliente eliminado',
        description: 'Cliente eliminado con éxito.',
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      style={{
        display: 'flex',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'tween' }}
    >
      <Flex
        border='1px solid gray'
        borderRadius={5}
        padding={isList ? 0.5 : 1}
        px={1}
        gap={5}
        width={isList ? '100%' : '300px'}
        maxW='300px'
        flexDirection={isList ? 'row' : 'column'}
        alignItems={isList ? 'center' : undefined}
        justifyContent='space-between'
        boxShadow='0 0 2px'
      >
        <Flex flexDir={isList ? 'row' : 'column'} gap={1}>
          <Text
            title={`${c.nombre} ${c.apellido}`}
            noOfLines={1}
            fontWeight='bold'
          >
            {c.apellido}, {c.nombre}
          </Text>
          {!isList && <Text fontStyle='italic'>{c.DNI}</Text>}
        </Flex>

        <Flex gap={2} justify='space-around' align='center'>
          <Button
            as={Link}
            size='xs'
            bg='blue.800'
            color='white'
            fontWeight='bold'
            _hover={{ opacity: 0.65 }}
            _active={{ bg: 'blue.700' }}
            href={`/ClientesID/${c.id}`}
          >
            Ver
          </Button>
          <DeleteModal
            textContent={<MdDelete />}
            title='Cliente'
            nombre={`${c.nombre} ${c.apellido}`}
            size='xs'
            loadingForm={loading}
            DeleteProp={() => handleDelete(c.id)}
          />
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default ClientCard;
