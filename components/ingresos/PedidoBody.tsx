import { getEstado } from '@/helpers/cobros/getEstado';
import { useThemeColors } from '@/hooks/useThemeColors';
import { EstadoColors, Estados, PedidoType } from '@/types/types';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
const PedidoBody = ({
  pedido,
  loading,
  size,
}: {
  pedido: PedidoType;
  loading?: boolean;
  size: 'inicio' | 'consulta';
}) => {
  const customSizes = {
    inicio: {
      title: '2xl',
      big: 'xl',
      small: 'lg',
    },
    consulta: {
      title: '2xl',
      big: 'xl',
      small: 'lg',
    },
  };
  const thisSize = customSizes[size];
  const { invertedTextColor } = useThemeColors();
  const { cliente, detalle, movimientos } = pedido ?? {};
  const estado = getEstado(movimientos);
  const prevColor =
    EstadoColors[Estados[Estados.indexOf(estado) - 1]] ?? 'gray';
  return (
    <Flex flexDir='column'>
      <Flex flexDir='column' gap={2} justify='space-between'>
        <motion.div
          key={EstadoColors[estado]}
          style={{
            display: 'flex',
            borderRadius: '10px',
            gap: 8,
            flexDirection: 'column',
            paddingRight: 6,
            paddingLeft: 6,
            color: invertedTextColor,
            width: 'fit-content',
          }}
          initial={{ backgroundColor: prevColor }}
          animate={{ backgroundColor: EstadoColors[estado] }}
          transition={{ duration: 1 }}
        >
          <Flex w='fit-content' fontSize={thisSize.big} gap={2}>
            <Text>Estado:</Text>
            {loading ? (
              ''
            ) : (
              <motion.p
                style={{ fontWeight: 'bold' }}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: 'tween' }}
              >
                {estado}
              </motion.p>
            )}
          </Flex>
        </motion.div>
        <Heading
          title={cliente}
          noOfLines={1}
          as='h2'
          fontSize={thisSize.title}
        >
          {cliente}
        </Heading>

        {/* {animated && <LottieAnimation url={LottieUrls[estado]} />} */}
      </Flex>
      <Text py={2} fontSize={thisSize.small}>
        {detalle}
      </Text>
    </Flex>
  );
};

export default PedidoBody;
