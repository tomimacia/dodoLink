import { EstadoType, ProductoType } from '@/types/types';
import {
  Checkbox,
  Flex,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

type ItemsHandlerType = [
  ProductoType[],
  React.Dispatch<React.SetStateAction<ProductoType[]>>
];

const CompraModalBottomPart = ({
  estado,
  itemsHandler,
  confirmedItems,
}: {
  estado: EstadoType;
  itemsHandler: ItemsHandlerType;
  confirmedItems: ProductoType[] | undefined;
}) => {
  const [items, setItems] = itemsHandler;
  const checkItem = (id: string) => {
    const newCheckedItems = items.map((i: any) => {
      if (i.id === id) {
        return { ...i, isChecked: !i.isChecked };
      }
      return i;
    });
    setItems(newCheckedItems);
  };
  const toMap = !confirmedItems
    ? items
    : items.filter((i) => !confirmedItems?.some((ci) => ci.id === i.id));
  return (
    <>
      {estado !== 'Finalizado' && (
        <Flex flexDir='column'>
          {estado !== 'Inicializado' && <Flex flexDir='column'></Flex>}
          <Text mb={2} fontSize='lg'>Confirmá los productos <b>que estás recibiendo</b></Text>
          <UnorderedList fontSize='lg' w='100%' maxW='400px'>
            {toMap.map((i) => {
              return (
                <ListItem key={`check-producto-key-${i.id}`} w='100%'>
                  <Flex
                    justify='space-between'
                    borderBottom='1px solid #BEBEBE'
                    w='100%'
                  >
                    <Flex gap={2}>
                      <Text noOfLines={1}>
                        <b>{i.nombre}</b>
                      </Text>
                      <Text>
                        x {i.unidades} {i.medida}
                      </Text>
                    </Flex>
                    <Checkbox
                      borderColor='#BEBEBE'
                      isChecked={i.isChecked}
                      onChange={() => checkItem(i.id)}
                    />
                  </Flex>
                </ListItem>
              );
            })}
          </UnorderedList>
        </Flex>
      )}
    </>
  );
};

export default CompraModalBottomPart;
