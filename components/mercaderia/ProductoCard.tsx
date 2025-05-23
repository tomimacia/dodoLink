import { useUser } from '@/context/userContext';
import useGetProductos from '@/hooks/data/useGetProductos';
import { ProductoType } from '@/types/types';
import {
  Box,
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
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

const MotionBox = motion(Box);

const ProductoCard = ({
  producto,
  delay,
  setNewProductos,
}: {
  producto: ProductoType;
  delay: number;
  setNewProductos: Dispatch<SetStateAction<ProductoType[]>>;
}) => {
  const { user } = useUser();
  const { nombre, cantidad, medida, codigo } = producto;
  const { updateProducto, allPacks } = useGetProductos(true);
  const bg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.500');
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }, // sin delay acá
    },
  };
  const setProductoFront = (newProducto: ProductoType) => {
    const { id } = newProducto;
    setNewProductos((prev) => {
      const newProductos = prev.map((p) => (p.id === id ? newProducto : p));
      return newProductos;
    });
  };
  return (
    <MotionBox
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      borderWidth='1px'
      borderRadius='xl'
      borderColor={borderColor}
      bg={bg}
      p={4}
      w='100%'
      maxW='500px'
      boxShadow='md'
    >
      <Flex direction='column' gap={2}>
        <Heading size='md' noOfLines={2}>
          {nombre}
        </Heading>

        <Flex align='center' gap={2} wrap='wrap'>
          <Text fontWeight='medium'>Código:</Text>
          {codigo.length > 1 ? (
            <Popover>
              <PopoverTrigger>
                <Text
                  cursor='pointer'
                  fontSize='sm'
                  fontWeight='bold'
                  color='blue.400'
                  _hover={{ textDecoration: 'underline' }}
                >
                  {codigo.length} códigos
                </Text>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <Flex direction='column' gap={1}>
                    {codigo.map((code) => (
                      <Text key={`code-${code}`} fontSize='sm'>
                        {code}
                      </Text>
                    ))}
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Text>{codigo[0]}</Text>
          )}
        </Flex>

        <Flex justify='space-between'>
          <Text fontWeight='medium'>Cantidad:</Text>
          <Text>
            <b>{cantidad}</b> x {medida}
          </Text>
        </Flex>

        {codigo.length > 0 && (
          <Box mt={2}>
            <Barcode width={2} height={50} value={codigo[0] + ''} />
          </Box>
        )}

        {user?.rol === 'Superadmin' && (
          <ProductoModal
            allPacks={allPacks || []}
            setNewProducto={setProductoFront}
            updateProducto={updateProducto}
            size='sm'
            producto={producto}
          />
        )}
      </Flex>
    </MotionBox>
  );
};

export default ProductoCard;
