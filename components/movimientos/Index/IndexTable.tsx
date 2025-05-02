import { addDots } from '@/helpers/addDots';
import dateTexto from '@/helpers/dateTexto';
import { IngresoType } from '@/types/types';
import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useMemo } from 'react';
import TableItem from './TableItem';

const IndexTable = ({
  arr,
  isIngreso,
  deleteMovimiento,
}: {
  arr: IngresoType[];
  isIngreso: boolean;
  showTitle?: boolean;
  deleteMovimiento: (day: string, seconds: number) => Promise<void>;
}) => {
  // Optimización con useMemo: evita recalcular en cada render
  const totalAbonado = useMemo(() => {
    return arr?.reduce((acc, it) => {
      const { pagoParcial, total } = it;
      return acc + (typeof pagoParcial === 'number' ? pagoParcial : total);
    }, 0);
  }, [arr]);

  const total = useMemo(() => {
    return arr?.reduce((acc, it) => acc + it.total, 0);
  }, [arr]);

  return (
    <Flex flexDir='column'>
      {arr?.length === 0 ? (
        <Text p={1} fontStyle='italic'>
          No hay {isIngreso ? 'ingresos' : 'egresos'} para esta hora
        </Text>
      ) : (
        <TableContainer my={2}>
          <Table
            fontSize='sm'
            size='xs'
            variant='striped'
            colorScheme='facebook'
          >
            <Thead>
              <Tr>
                <Th>Fecha</Th>
                <Th>Hora</Th>
                <Th>Detalle</Th>
                <Th>Abonado</Th>
                <Th>Total</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {arr.toReversed().map((i, ind) => {
                const { cliente } = i;
                return (
                  <TableItem
                    key={`user-${i.total}-${ind}`}
                    i={i}
                    cliente={cliente}
                    deleteMovimiento={() =>
                      deleteMovimiento(
                        dateTexto(i?.fecha.seconds).slashDate,
                        i?.fecha.seconds
                      )
                    }
                  />
                );
              })}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th></Th>
                <Th></Th>
                <Th>${addDots(totalAbonado)}</Th>
                <Th>${addDots(total)}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </Flex>
  );
};

export default IndexTable;
