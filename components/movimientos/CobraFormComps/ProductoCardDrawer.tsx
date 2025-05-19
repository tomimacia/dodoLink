import { ProductoType } from '@/types/types';
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);
const MotionBox = motion.div;

const ProductoCardDrawer = ({
  p,
  isSeleccionado,
  toggleSeleccion,
  handlePacks,
  getCantidad,
  handleChange,
}: {
  p: ProductoType;
  isSeleccionado: (id: string) => boolean;
  toggleSeleccion: (p: ProductoType) => void;
  handlePacks: (p: ProductoType, isSum: boolean) => void;
  getCantidad: (id: string) => number | '';
  handleChange: (e: any, id: string) => void;
}) => {
  const isSelected = isSeleccionado(p.id);
  const borderColor = isSelected ? '#4A5568' : '#E2E8F0';
  const buttonBG = useColorModeValue('gray.700', 'white');
  const buttonColor = useColorModeValue('white', 'gray.900');

  return (
    <MotionFlex
      layout
      key={p.id}
      border='1px solid'
      borderColor={borderColor}
      borderRadius='md'
      flexDirection='column'
      gap={3}
    >
      {/* Cabecera: nombre, checkbox, info básica */}
      <Flex
        cursor='pointer'
        onClick={() => toggleSeleccion(p)}
        p={3}
        flexDir='column'
      >
        <HStack justify='space-between' align='flex-start'>
          <Checkbox onChange={() => toggleSeleccion(p)} isChecked={isSelected}>
            <Text
              title={p.nombre}
              noOfLines={1}
              fontWeight='medium'
              fontSize='sm'
            >
              {p.nombre}
            </Text>
          </Checkbox>
        </HStack>
        <HStack justify='flex-end' gap={3} fontSize='sm' color='gray.500'>
          <Text>Por pack: {p.cantidadPorPack}</Text>
          <Text>
            Cantidad: <b>{p.cantidad}</b>
          </Text>
          <Text>
            Target: <b>{p.target}</b>
          </Text>
        </HStack>
      </Flex>

      {/* Contenido desplegable animado */}
      <MotionBox
        layout
        initial={false}
        animate={
          isSelected
            ? { opacity: 1, height: 'auto' }
            : { opacity: 0, height: 0 }
        }
        style={{ overflow: 'hidden' }}
      >
        <Divider w='95%' mx='auto' borderColor='gray' my={2} />
        <Flex p={3} fontSize='sm' justify='space-between' align='center'>
          {/* Selector de Packs */}
          <Flex align='center' gap={2}>
            <Text>Packs</Text>
            <HStack gap={2} maxW='320px'>
              <Button
                size='xs'
                bg={buttonBG}
                color={buttonColor}
                _hover={{ opacity: 0.7 }}
                fontSize='md'
                onClick={() => handlePacks(p, true)}
              >
                +
              </Button>
              <Text fontWeight='bold'>
                {(((getCantidad(p.id) || 0) / p.cantidadPorPack).toFixed(
                  2
                ) as any) / 1}
              </Text>
              <Button
                size='xs'
                fontSize='md'
                bg={buttonBG}
                color={buttonColor}
                _hover={{ opacity: 0.7 }}
                onClick={() => handlePacks(p, false)}
              >
                -
              </Button>
            </HStack>
          </Flex>

          {/* Total */}
          <Flex align='center' gap={1}>
            <Text>Total</Text>
            <HStack gap={5} maxW='320px'>
              <Input
                borderColor='gray'
                size='sm'
                borderRadius={5}
                type='number'
                placeholder={p.medida}
                value={getCantidad(p.id)}
                onChange={(e) => handleChange(e, p.id)}
                w='80px'
              />
            </HStack>
          </Flex>
        </Flex>
      </MotionBox>
    </MotionFlex>
  );
};

export default ProductoCardDrawer;
