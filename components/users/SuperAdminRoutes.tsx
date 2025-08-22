'use client';

import { allRoles, Routes } from '@/data/data'; // ajustá la ruta a tu archivo real
import { RolType } from '@/types/types';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaCheck } from 'react-icons/fa';

const hasAccess = (roles: RolType[], rol: RolType) => roles.includes(rol);

const SuperAdminRoutes = () => {
  return (
    <Box my={6} overflowX='auto' maxW='800px'>
      <Text fontSize='2xl' fontWeight='bold' mb={4}>
        Accesos por Rol
      </Text>
      <Table mt={10} variant='simple' size='sm'>
        <Thead>
          <Tr>
            <Th>Ruta</Th>
            {allRoles.map((rol) => (
              <Th key={rol + '-all-roles'} textAlign='center'>
                {rol}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Routes.map((route) => (
            <Fragment key={route.route + '-main-route'}>
              <Tr>
                <Td fontWeight='semibold'>{route.label}</Td>
                {allRoles.map((rol) => (
                  <Td key={rol} textAlign='center'>
                    {hasAccess(route.roles as any, rol as RolType) ? (
                      <Icon as={FaCheck} color='green.500' />
                    ) : (
                      <Icon as={CloseIcon} color='red.500' />
                    )}
                  </Td>
                ))}
              </Tr>
              {route.subRoutes.map((subRoute) => (
                <Tr key={subRoute.route + '-sub-route'}>
                  <Td pl={6}>↳ {subRoute.label}</Td>
                  {allRoles.map((rol) => (
                    <Td key={rol} textAlign='center'>
                      {hasAccess(subRoute.roles as any, rol as RolType) ? (
                        <Icon as={FaCheck} color='green.500' />
                      ) : (
                        <Icon as={CloseIcon} color='red.500' />
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SuperAdminRoutes;
