'use client';

import PaginationControl from '@/components/reservas/PaginationControl';
import dateTexto from '@/helpers/dateTexto';
import useGetClientes from '@/hooks/data/useGetClientes';
import usePagination from '@/hooks/data/usePagination';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button, chakra, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FaListUl, FaThLarge, FaThList } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';
import ReactLoading from 'react-loading';
import { HighlightedText } from '../HighlightedText';
const MotionLink = chakra(motion(Link)) as any;
const ClientesIndexPage = () => {
  const { clientes, loadingClientes, getClientes } = useGetClientes();
  const [isList, setIsList] = useState(false);
  const [filterInput, setFilterInput] = useState('');
  const { loadingColor } = useThemeColors();
  const router = useRouter();
  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    return clientes
      .filter((p) => {
        const { firstname, lastname, email, companyname } = p;
        const toFind = [firstname, lastname, companyname, email]
          .filter(Boolean)
          .join(' ');
        const matchesFilter =
          filterInput.length < 3 ||
          toFind.toLowerCase().includes(filterInput.toLowerCase());

        return matchesFilter;
      })
      .sort((a, b) => a.lastname.localeCompare(b.lastname));
  }, [clientes, filterInput]);
  const itemsPerPage = 28;
  const {
    paginatedArr,
    page,
    totalPages,
    goingUp,
    handlePageChange: setPage,
  } = usePagination(filteredClientes, itemsPerPage, true);

  useEffect(() => {
    if (router.query.page) {
      const pageNumber = Number(router.query.page) - 1;

      if (totalPages > pageNumber) {
        setPage(pageNumber);
      }
    }
  }, []);

  // Actualizar query cuando cambia página
  const handlePageChange = (newPage: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage + 1 },
      },
      undefined,
      { shallow: true }
    );
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            placeholder='Filtrar clientes'
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
            show={!!clientes && clientes?.length > itemsPerPage}
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
                <MotionLink
                  href={`/ClienteID/${cliente?.id}`}
                  key={cliente.id + '' + index}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, type: 'tween' }}
                  flexDir='column'
                  display='flex'
                  p={{ base: 1, md: 2, lg: 3 }}
                  w={!isList ? wrappedWidth : '100%'}
                  borderWidth='1px'
                  borderRadius='xl'
                  boxShadow='md'
                  gap={0.5}
                  justifyContent='space-between'
                  _hover={{ boxShadow: 'lg' }}
                  cursor='pointer'
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

                  {/* Company + Nombre (altura fija) */}
                  <Flex direction='column' minH='40px'>
                    <Text noOfLines={1} fontSize='lg' fontWeight='bold'>
                      <HighlightedText
                        text={
                          cliente.companyname ||
                          `${cliente.firstname} ${cliente.lastname}`
                        }
                        query={filterInput.length > 2 ? filterInput : ''}
                      />
                    </Text>
                    <Text noOfLines={1} color='gray.500' fontSize='sm'>
                      <HighlightedText
                        text={`${cliente.firstname} ${cliente.lastname}`}
                        query={filterInput.length > 2 ? filterInput : ''}
                      />
                    </Text>
                  </Flex>

                  {/* Email */}
                  <Text noOfLines={1} color='gray.400' fontSize='sm'>
                    <HighlightedText
                      text={cliente.email}
                      query={filterInput.length > 2 ? filterInput : ''}
                    />
                  </Text>
                </MotionLink>
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

export default ClientesIndexPage;
