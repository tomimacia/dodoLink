'use client';

import PaginationControl from '@/components/reservas/PaginationControl';
import useGetNodos from '@/hooks/data/useGetNodos';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NodoType } from '@/types/types';
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaListUl, FaThLarge, FaThList } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';
import ReactLoading from 'react-loading';

const NodosIndexPage = () => {
  const { nodos, loadingNodos, getNodos } = useGetNodos();
  const [isList, setIsList] = useState(false);
  const [filterInput, setFilterInput] = useState('');
  const { loadingColor } = useThemeColors();
  const filteredNodos = useMemo(() => {
    if (!nodos) return [];
    return nodos
      .filter((p) => {
        const { first_name, last_name, email } = p;
        const toFind = [first_name, last_name, email].join(' ');
        const matchesFilter =
          filterInput.length < 3 ||
          toFind?.toLowerCase().includes(filterInput.toLowerCase());

        return matchesFilter;
      })
      .sort((a, b) => a.last_name.localeCompare(b.last_name));
  }, [nodos, filterInput]);
  const itemsPerPage = 12;
  const { paginatedArr, page, totalPages, goingUp, handlePageChange } =
    usePagination(filteredNodos, itemsPerPage, true);
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
            onClick={getNodos}
            isLoading={loadingNodos}
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
            placeholder='Fitrar nodos'
            borderRadius='md'
            borderColor='gray.300'
          />
        </Flex>
      </Flex>
      <Text color='gray.400'>Total Nodos: {nodos?.length}</Text>
      {loadingNodos && (
        <Flex maxW='700px' my={10} justify='center'>
          <ReactLoading
            type='bars'
            color={loadingColor}
            height='100px'
            width='50px'
          />
        </Flex>
      )}
      {!loadingNodos && (
        <Flex gap={3} flexDir='column'>
          <PaginationControl
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            show={nodos && nodos?.length > itemsPerPage ? true : false}
          />
          <motion.div
            key={`nodos-content-${page}-${isList ? 'list' : 'grid'}`}
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
            {paginatedArr?.map((nodo: NodoType, index: number) => {
              return (
                <Flex
                  flexDir='column'
                  as={Link}
                  href={`/NodosID/${nodo?.id}`}
                  key={nodo?.id + '' + index}
                  p={{ base: 1, md: 2, lg: 3 }}
                  w={!isList ? wrappedWidth : '100%'}
                  borderWidth='1px'
                  borderRadius='xl'
                  boxShadow='md'
                  gap={0.5}
                  justifyContent='space-between'
                  _hover={{ boxShadow: 'lg' }}
                >
                  <Flex flexDir='column' gap={1}>
                    <Text fontWeight='bold' fontSize='lg'>
                      {nodo?.nombre}
                    </Text>
                    <Text fontSize='sm' color='gray.500'>
                      Equipos: {nodo?.equipos?.length ?? 0}
                    </Text>
                    <Text fontSize='sm' color='gray.500'>
                      VLANs: {nodo?.vlans?.length ?? 0}
                    </Text>
                  </Flex>
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

export default NodosIndexPage;
