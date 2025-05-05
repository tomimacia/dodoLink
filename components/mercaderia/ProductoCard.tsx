import { useUser } from '@/context/userContext';
import useGetProductos from '@/hooks/data/useGetProductos';
import { ProductoType } from '@/types/types';
import {
  Flex,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Barcode from 'react-barcode';
import ProductoModal from './Editar/ProductoModal';
const ProductoCard = ({
  producto,
  setNewProducto,
}: {
  producto: ProductoType;
  setNewProducto: (newProducto: ProductoType) => void;
}) => {
  const { user } = useUser();
  const { nombre, cantidad, medida, codigo } = producto;
  const { updateProducto } = useGetProductos();
  const customBG = useColorModeValue('gray.800', 'white');
  const customColor = useColorModeValue('white', 'black');
  return (
    <Flex gap={2} flexDir='column'>
      <Flex flexDir='column'>
        <Heading size='lg'>{nombre}</Heading>
        <Flex gap={2}>
          <Text fontStyle='italic'>Código:</Text>
          {codigo.length > 1 ? (
            <Popover>
              <PopoverTrigger>
                <Text cursor='pointer'>{codigo.length} Códigos</Text>
              </PopoverTrigger>
              <PopoverContent bg={customBG} color={customColor} w='100%'>
                <PopoverBody boxShadow='0 0 5px'>
                  <Flex flexDir='column' gap={1}>
                    {codigo.map((code) => (
                      <Text key={`table-item-key-code-${code}`}>{code}</Text>
                    ))}
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Text>{codigo[0]}</Text>
          )}
        </Flex>
      </Flex>
      <Flex w='100%' maxW='500px' fontSize='lg' p={2} flexDir='column' gap={1}>
        <Flex align='center' justify='space-between' gap={2}>
          <Text>Cantidad:</Text>
          <Text>
            <b>{cantidad}</b> x {medida}
          </Text>
        </Flex>
      </Flex>
      {codigo.length > 0 && <Barcode width={4} value={codigo[0] + ''} />}
      {user?.rol === 'Superadmin' && (
        <ProductoModal
          setNewProducto={setNewProducto}
          updateProducto={updateProducto}
          size='sm'
          producto={producto}
        />
      )}
    </Flex>
  );
};

export default ProductoCard;
