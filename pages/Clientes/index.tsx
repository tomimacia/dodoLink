'use client';

import PaginationControl from '@/components/reservas/PaginationControl';
import useGetClientes from '@/hooks/data/useGetClientes';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Box, Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaListUl, FaThLarge, FaThList } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';
import ReactLoading from 'react-loading';
import { motion } from 'framer-motion';
import dateTexto from '@/helpers/dateTexto';
const Listado = () => {
  const { clientes, loadingClientes, getClientes } = useGetClientes();
  const [isList, setIsList] = useState(false);
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
  const itemsPerPage = 12;
  const { paginatedArr, page, totalPages, goingUp, handlePageChange } =
    usePagination(filteredClientes, itemsPerPage, true);
  const wrappedWidth = ['100%', '100%', '48%', '32%', '24%'];
  return (
    <Flex flexDir='column' gap={4}>
      <Flex
        gap={4}
        direction={{ base: 'column', md: 'row' }}
        align='center'
        justify='space-between'
        p={4}
        rounded='md'
        boxShadow='sm'
        border='1px solid'
        borderColor='gray.200'
      >
        <Flex gap={2} align='center' wrap='wrap'>
          <Button
            bg='gray.600'
            color='white'
            size='sm'
            _hover={{ bg: 'gray.700' }}
            onClick={getClientes}
            isLoading={loadingClientes}
          >
            Actualizar
          </Button>
        </Flex>

        <Flex gap={3} align='center'>
          <Icon
            fontSize='22px'
            cursor='pointer'
            as={isList ? FaTableCellsLarge : FaThLarge}
            color={isList ? 'gray.400' : 'gray.700'}
            _dark={{ color: isList ? 'gray.400' : 'gray.200' }}
            onClick={() => setIsList(false)}
          />
          <Icon
            fontSize='22px'
            cursor='pointer'
            as={isList ? FaThList : FaListUl}
            color={isList ? 'gray.700' : 'gray.400'}
            _dark={{ color: isList ? 'gray.200' : 'gray.400' }}
            onClick={() => setIsList(true)}
          />
          <Input
            size='sm'
            maxW='200px'
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            placeholder='Fitrar clientes'
            borderRadius='md'
            borderColor='gray.300'
          />
        </Flex>
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
          <motion.div
            key={`clientes-content-${page}-${isList ? 'list' : 'grid'}`}
            style={{
              display: 'flex',
              flexDirection: isList ? 'column' : undefined,
              flexWrap: isList ? undefined : 'wrap',
              gap: 12,
              padding: 8,
              marginTop: 8,
            }}
            initial={{ opacity: 0, x: goingUp ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: goingUp ? -15 : 15 }}
          >
            {paginatedArr?.map((cliente: any, index: number) => {
              return (
                <Flex
                  flexDir='column'
                  as={Link}
                  href={`/ClienteID/${cliente?.id}`}
                  key={cliente.id + '' + index}
                  p={{ base: 1, md: 2, lg: 3 }}
                  w={!isList ? wrappedWidth : '100%'}
                  borderWidth='1px'
                  borderRadius='xl'
                  boxShadow='md'
                  gap={0.5}
                  justifyContent='space-between'
                  _hover={{ boxShadow: 'lg' }}
                >
                  {!!cliente?.updated_at && (
                    <Text fontSize='xs' color='gray.400'>
                      Actualizado:{' '}
                      {
                        dateTexto(new Date(cliente.updated_at).getTime() / 1000)
                          .numDate
                      }
                    </Text>
                  )}
                  <Text noOfLines={1} fontSize='lg' fontWeight='bold'>
                    {cliente.first_name} {cliente.last_name}
                  </Text>
                  <Text noOfLines={1} color='gray.400' fontSize='sm'>
                    {cliente.email}
                  </Text>
                </Flex>
              );
            })}
          </motion.div>
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
