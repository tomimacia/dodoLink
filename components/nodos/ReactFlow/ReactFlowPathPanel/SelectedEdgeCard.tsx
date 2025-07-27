'use client';

import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Edge } from 'reactflow';
import PortHandle from './PortHandle';
const SelectedEdgeCard = ({
  e,
  removeEdge,
  onToggle,
  editing,
  updatePort,
}: {
  e: Edge;
  removeEdge: (edgeID: string) => void;
  onToggle: () => void;
  editing: boolean;
  updatePort: (field: string, newPort: string | number) => void;
}) => {
  const customBlue = useColorModeValue('blue.600', 'blue.300');
  return (
    <Box
      key={e.id}
      borderWidth='1px'
      borderRadius='md'
      p={1}
      px={2}
      boxShadow='sm'
      _hover={{ boxShadow: 'md' }}
    >
      <Flex
        cursor='pointer'
        onClick={onToggle}
        justify='space-between'
        align='center'
      >
        <Tooltip label={e.data.vlan} hasArrow>
          <Text fontSize='sm' fontWeight='semibold' isTruncated maxW='100px'>
            {e.data.vlan || 'Sin VLAN'}
          </Text>
        </Tooltip>

        <Flex align='center' gap={1}>
          <Text fontSize='xs' color={customBlue}>
            Puertos
          </Text>
          <motion.div animate={{ rotate: editing ? 0 : 180 }}>
            <ChevronUpIcon aria-label='editar-tramo' />
          </motion.div>
        </Flex>
      </Flex>

      <Collapse in={editing} animateOpacity>
        <Flex mt={3} direction='column' gap={2}>
          <Text fontSize='xs' mb={1}>
            Puertos
          </Text>

          <Flex justify='space-between' gap={3}>
            {/* Source Port */}
            <PortHandle
              updatePort={updatePort}
              data={e.data}
              field='sourcePort'
            />

            {/* Target Port */}
            <PortHandle
              updatePort={updatePort}
              data={e.data}
              field='targetPort'
            />
          </Flex>
          <Flex>
            <Button
              size='xs'
              variant='outline'
              colorScheme='red'
              aria-label='Eliminar'
              onClick={() => removeEdge(e.id)}
            >
              Eliminar Tramo
            </Button>
          </Flex>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default SelectedEdgeCard;
