'use client';

import PaginationControl from '@/components/reservas/PaginationControl';
import useGetClientes from '@/hooks/data/useGetClientes';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ReactLoading from 'react-loading';

const Listado = () => {
  const { clientes, loadingClientes, getClientes } = useGetClientes();
  const [filterInput, setFilterInput] = useState('');
  const { loadingColor } = useThemeColors();
  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    return clientes
      .filter((p) => {
        const { first_name, last_name, email } = p;
        const toFind = [first_name, last_name, email].join(' ');
        const matchesFilter =
          filterInput.length < 3 ||
          toFind?.toLowerCase().includes(filterInput.toLowerCase());

        return matchesFilter;
      })
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
  }, [clientes, filterInput]);
  const itemsPerPage = 10;
  const { paginatedArr, page, totalPages, handlePageChange } = usePagination(
    filteredClientes,
    itemsPerPage,
    true
  );

  return (
    <Flex flexDir='column' gap={4}>
      <Button
        size='sm'
        bg='gray.700'
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.8 }}
        onClick={getClientes}
        isLoading={loadingClientes}
      >
        Actualizar
      </Button>
      <Flex align='center' gap={2}>
        <Text fontWeight='medium'>Buscar:</Text>
        <Input
          size='sm'
          maxW='200px'
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          placeholder='Ingresar nombre'
          borderRadius='md'
          borderColor='gray.300'
        />
      </Flex>
      <Text color='gray.400'>Total Clientes: {clientes?.length}</Text>
      {loadingClientes && (
        <Flex maxW='700px' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color={loadingColor}
            height='100px'
            width='50px'
          />
        </Flex>
      )}
      {!loadingClientes && (
        <Flex gap={3} flexDir='column'>
          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={clientes && clientes?.length > itemsPerPage ? true : false}
          />
          {paginatedArr?.map((cliente: any, index: number) => {
            return (
              <Box
                as={Link}
                href={`/ClienteID/${cliente?.id}`}
                key={cliente.id + '' + index}
                p={4}
                borderWidth='1px'
                borderRadius='xl'
                boxShadow='md'
                _hover={{ boxShadow: 'lg' }}
              >
                <Text fontSize='lg' fontWeight='bold'>
                  {cliente.first_name} {cliente.last_name}
                </Text>
                <Text color='gray.400' fontSize='sm'>
                  {cliente.email}
                </Text>
              </Box>
            );
          })}
          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={paginatedArr?.length > 5}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default Listado;
