'use client';

import PaginationControl from '@/components/reservas/PaginationControl';
import useGetClientes from '@/hooks/data/useGetClientes';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import ReactLoading from 'react-loading';
const Listado = () => {
  const { clientes, loadingClientes, getClientes } = useGetClientes();
  const { loadingColor } = useThemeColors();
  const itemsPerPage = 10;
  const { paginatedArr, page, totalPages, handlePageChange } = usePagination(
    clientes || [],
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
