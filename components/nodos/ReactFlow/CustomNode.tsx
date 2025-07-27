import { EquipoType } from '@/types/types';
import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { IconMap } from './SVGs/IconMap';

type EquipoNodeProps = NodeProps<EquipoType>;

const CustomNode = ({ data }: EquipoNodeProps) => {
  const iconSize = '48px';

  // 🎨 Gradientes y colores según modo
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, gray.100)',
    'linear(to-br, gray.600, gray.800)'
  );
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const iconBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const handleColor = useColorModeValue('#3182ce', '#90cdf4');

  return (
    <Box
      p={2}
      bgGradient={bgGradient}
      border='1px solid'
      borderColor={borderColor}
      borderRadius='xl'
      boxShadow='lg'
      position='relative'
      minW='90px'
      maxW='130px'
      textAlign='center'
    >
      {/* TEXTOS HORIZONTALES TARGET Y SOURCE */}
      {data?.selectedType === 'equipoSource' && (
        <Text
          pos='absolute'
          top='-2'
          right='-2'
          px={2}
          py={0.5}
          fontSize='10px'
          fontWeight='bold'
          borderRadius='md'
          color='white'
          bg='blue.500'
          backdropFilter='blur(4px)'
          border='1px solid rgba(255, 255, 255, 0.2)'
          zIndex={10}
          boxShadow='sm'
        >
          Source
        </Text>
      )}
      {data?.selectedType === 'equipoTarget' && (
        <Text
          pos='absolute'
          top='-2'
          left='-2'
          px={2}
          py={0.5}
          fontSize='10px'
          fontWeight='bold'
          borderRadius='md'
          color='white'
          bg='green.500'
          backdropFilter='blur(4px)'
          border='1px solid rgba(255, 255, 255, 0.2)'
          zIndex={10}
          boxShadow='sm'
        >
          Target
        </Text>
      )}
      <Handle
        id={`source-handle-${data?.id}`}
        type='source'
        position={Position.Right}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          background: handleColor,
        }}
      />
      <Handle
        id={`target-handle-${data?.id}`}
        type='target'
        position={Position.Left}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          background: handleColor,
        }}
      />
      <Flex
        w={iconSize}
        h={iconSize}
        bg={iconBg}
        borderRadius='full'
        align='center'
        justify='center'
        mx='auto'
        mb={1}
        boxShadow='sm'
      >
        <Image src={IconMap[data.tipo].src} alt={data.tipo} maxH='60%' />
      </Flex>
      <Text
        fontSize='xs'
        fontWeight='medium'
        noOfLines={2}
        px={1}
        color={textColor}
      >
        {data.nombre}
      </Text>
    </Box>
  );
};

// 👇 Esto evita el warning
CustomNode.displayName = 'CustomNode';

export default memo(CustomNode);
