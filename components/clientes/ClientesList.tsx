import usePagination from '@/hooks/data/usePagination';
import useGetClientes from '@/hooks/useGetClientes';
import { Button, Flex, Heading, Icon, Input, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { FaListUl, FaThLarge, FaThList } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';
import ReactLoading from 'react-loading';
import ClientCard from './ClientCard';
import PaginationControl from './PaginationControl';
import CopyButton from '../CopyButton';
const ClientesList = () => {
  const { clientes, getClientes, setClientes, loadingClientes } =
    useGetClientes();
  const [isList, setIsList] = useState(false);
  const [consulta, setConsulta] = useState('');
  const filterClientes = useCallback(() => {
    if (consulta.trim().length < 2) return clientes; // Evita búsquedas con pocos caracteres

    return clientes.filter((c) => {
      const consultaLower = consulta.toLowerCase().trim(); // Limpia espacios extras
      return (
        c.nombre.toLowerCase().includes(consultaLower) ||
        c.apellido.toLowerCase().includes(consultaLower) ||
        c.DNI.toString().includes(consultaLower) // Convierte dni en string por si es número
      );
    });
  }, [consulta, clientes]);
  const filteredClients = filterClientes();
  const itemsPerPage = 12;
  const orderedClientes = filteredClients.sort((a, b) => {
    const nameA = `${a?.apellido} ${a?.nombre}`.toLowerCase();
    const nameB = `${b?.apellido} ${b?.nombre}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const { page, goingUp, totalPages, paginatedArr, handlePageChange } =
    usePagination(orderedClientes, itemsPerPage);
  const deleteClienteFront = (clientID: string) => {
    const newClientes = clientes.filter((c) => c.id !== clientID);
    setClientes(newClientes);
  };
  const mails = clientes.filter((c) => c?.email).map((c) => c.email);
  return (
    <Flex gap={3} flexDir='column'>
      <Heading size='md'>Listado de Clientes</Heading>
      <Flex flexDir='column' gap={2}>
        <Button
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={getClientes}
          isLoading={loadingClientes}
        >
          Actualizar
        </Button>
        <Flex align='center' gap={1}>
          <Text>Copiar Emails</Text>
          <CopyButton
            content={mails.join(',')}
            description={`${mails.length} email copiados al portapapeles`}
          />
        </Flex>
      </Flex>
      <Flex gap={2} align='center'>
        <Icon
          fontSize={30}
          cursor='pointer'
          onClick={() => setIsList(false)}
          as={isList ? FaTableCellsLarge : FaThLarge}
        />
        <Icon
          fontSize={30}
          cursor='pointer'
          onClick={() => setIsList(true)}
          as={isList ? FaThList : FaListUl}
        />
        <Input
          size='sm'
          autoComplete='off'
          formNoValidate
          borderRadius={5}
          onChange={(e) => setConsulta(e.target.value)}
          maxW='200px'
          borderColor='gray'
          placeholder='Buscar por nombre, DNI'
        />
      </Flex>
      {loadingClientes ? (
        <Flex w='100%' justify='center'>
          <ReactLoading type='bars' color='#333c87' />
        </Flex>
      ) : (
        <Flex gap={5} flexDir='column'>
          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={filteredClients.length > itemsPerPage}
          />
          <AnimatePresence mode='wait'>
            <motion.div
              key={`custom-key-pagination-${page}-${
                isList ? 'lista' : 'cards'
              }`}
              style={{
                padding: 8,
                marginTop: 8,
                marginBottom: 8,
                display: 'flex',
                flexDirection: isList ? 'column' : undefined,
                flexWrap: isList ? undefined : 'wrap',
                gap: 6,
              }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: goingUp ? 15 : -15, opacity: 0 }}
              exit={{ x: goingUp ? -15 : 15, opacity: 0 }}
            >
              {paginatedArr.map((c) => {
                return (
                  <ClientCard
                    key={`client-list-key${c.id}`}
                    c={c}
                    isList={isList}
                    deleteClienteFront={deleteClienteFront}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>

          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={filteredClients.length > itemsPerPage}
          />
        </Flex>
      )}
      {!loadingClientes && clientes.length === 0 && (
        <Text>No se encontraron resultados</Text>
      )}
    </Flex>
  );
};

export default ClientesList;
