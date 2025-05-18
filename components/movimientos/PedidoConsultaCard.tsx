import { getEstado } from '@/helpers/cobros/getEstado';
import dateTexto from '@/helpers/dateTexto';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EstadoColors, PedidoType } from '@/types/types';
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaListUl } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import MapEmbed from './EmbedMap';

const PedidoConsultaCard = ({
  pedido,
  isCompra,
}: {
  pedido: PedidoType;
  isCompra: boolean;
}) => {
  const estadoActual = getEstado(pedido?.movimientos);

  const estadoData = pedido.movimientos[estadoActual];
  const color = EstadoColors[estadoActual];
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  const itemCustomGrayBG = useColorModeValue('gray.100', 'gray.700');
  const { brandColorLigth, brandColorDark } = useThemeColors();

  return (
    <Box
      p={6}
      bg={bg}
      borderRadius='2xl'
      borderWidth='1px'
      borderColor={border}
      shadow='md'
      w='100%'
    >
      <Stack spacing={4}>
        <Flex justify='space-between' align='center'>
          <Heading size='md'>#{pedido.id}</Heading>
          <Badge
            px={3}
            py={1}
            borderRadius='md'
            bg={color}
            color='white'
            fontSize='sm'
          >
            {estadoActual}
          </Badge>
        </Flex>

        <Divider />

        <Stack spacing={1}>
          <Text fontSize='sm' color='gray.500'>
            Cliente
          </Text>
          <Text fontWeight='medium'>{pedido.cliente}</Text>
        </Stack>

        {estadoData?.fecha && (
          <Stack spacing={1}>
            <Text fontSize='sm' color='gray.500'>
              Última actualización
            </Text>
            <Text>
              {dateTexto(estadoData.fecha.seconds).numDate} -{' '}
              {dateTexto(estadoData.fecha.seconds).hourDate} hs
            </Text>
          </Stack>
        )}

        {!isCompra && pedido.mapCoords && (
          <>
            <Divider />
            <Stack spacing={2}>
              <Flex align='center' gap={2}>
                <Icon as={IoLocation} boxSize={5} />
                <Text fontWeight='semibold'>Ubicación del pedido</Text>
              </Flex>
              <Box h='300px' borderRadius='md' overflow='hidden'>
                <MapEmbed hideButtons initialShow src={pedido.mapCoords} />
              </Box>
            </Stack>
          </>
        )}

        {pedido.tramo && !isCompra && (
          <Stack spacing={1}>
            <Text fontSize='sm' color='gray.500'>
              Tramo
            </Text>
            <Text>{pedido.tramo} mts</Text>
          </Stack>
        )}

        <Divider />
        <Flex align='center' gap={2}>
          <Icon as={FaListUl} boxSize={5} />
          <Text fontWeight='semibold'>Ítems del pedido</Text>
        </Flex>

        <VStack align='start' spacing={1} pl={1}>
          {pedido.items.map((item, index) => (
            <Box
              key={index}
              bg={itemCustomGrayBG}
              px={3}
              py={1}
              borderRadius='md'
              w='full'
            >
              <Text fontSize='sm'>
                {item.nombre} x{' '}
                <strong>
                  {item?.unidades} {item.medida}
                </strong>
              </Text>
            </Box>
          ))}
        </VStack>
      </Stack>
      <Flex justify='center' my={7}>
        <Button
          as={Link}
          href={`/PedidosID/${pedido.id}`}
          target='_blank'
          bg={brandColorLigth}
          color={brandColorDark}
          size='sm'
          borderRadius='md'
          _hover={{ bg: 'gray.600' }}
          transition='all 0.2s'
        >
          Ver Pedido
        </Button>
      </Flex>
    </Box>
  );
};

export default PedidoConsultaCard;
