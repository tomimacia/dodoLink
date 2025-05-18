import { useCobrarFormContext } from '@/context/useCobrarFormContext';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

const ProductosTable = () => {
  const { items, setItems, isPago } = useCobrarFormContext();

  if (items.length <= 0) return;
  const actualizarUnidades = (index: number, nuevasUnidades: string) => {
    const cantidadNumerica = nuevasUnidades === '' ? 0 : Number(nuevasUnidades);
    const nuevosItems = [...items];
    nuevosItems[index].unidades = cantidadNumerica;
    setItems(nuevosItems);
  };
  const deleteItem = (index: number) => {
    setItems(items.filter((_, ind) => ind !== index));
  };
  return (
    <Flex flexDir='column' gap={1} w='100%'>
      <TableContainer w='100%' my={2}>
        <Table fontSize='sm' size='xs' variant='striped' colorScheme='facebook'>
          <Thead>
            <Tr>
              <Th maxW='400px'>Stock</Th>

              <Th>Packs</Th>
              <Th>Concepto</Th>
              <Th maxW='60px'>Cant.</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((it, index) => {
              const {
                nombre,
                cantidad,
                unidades,
                medida,
                codigo,
                cantidadPorPack,
              } = it;
              const showFaltante =
                !isPago && (cantidad === 0 || cantidad < (unidades || 0));
              return (
                <Tr key={`item-${codigo?.join('-')}-${index}`}>
                  <Td maxW='400px'>
                    <Text
                      fontWeight={showFaltante ? 'bold' : 'normal'}
                      color={showFaltante ? 'red.500' : undefined}
                    >
                      {cantidad} ({medida})
                    </Text>
                  </Td>
                  <Td>{(cantidad / cantidadPorPack).toFixed(2)}</Td>
                  <Td>{nombre}</Td>
                  <Td maxW='60px'>
                    <NumberInput
                      size='sm'
                      value={unidades}
                      onChange={(valueString) =>
                        actualizarUnidades(index, valueString)
                      }
                      min={0}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>

                  <Td>
                    <DeleteIcon
                      onClick={() => deleteItem(index)}
                      cursor='pointer'
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th fontSize='lg'></Th>
              <Th fontSize='lg'></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default ProductosTable;
