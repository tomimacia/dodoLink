import { lineIcons, lineTypes } from '@/data/data';
import { EdgeLineType, HighlightType } from '@/types/types';
import {
  ArrowForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { Edge, Panel } from 'reactflow'; // Usamos 'reactflow' en vez de 'react-flow-renderer'
import SelectedEdgeCard from './SelectedEdgeCard';

const ReactFlowPathPanel = ({
  selectedNode,
  vlanPath,
  selectedEdges,
  removeTramo,
  removeEdge,
  setEdges,
  highlight,
  vlanSelected,
}: {
  vlanPath: any;
  selectedEdges: Edge[];
  selectedNode: {
    selectedSourceNode: any;
    selectedTargetNode: any;
  };
  vlanSelected: string | null;
  removeTramo: () => void;
  removeEdge: (edgeID: string) => void;
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>;
  highlight: HighlightType;
}) => {
  const { selectedSourceNode, selectedTargetNode } = selectedNode;
  const lowGray = useColorModeValue('gray.600', 'gray.200');
  const [editingVlan, setEditingVlan] = useState<string | null>(vlanSelected);

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const updateEdges = (newEdgeLine: EdgeLineType) => {
    setEdges((prev) =>
      prev.map((e) =>
        selectedEdges.some((se) => se.id === e.id)
          ? {
              ...e,
              type: newEdgeLine,
            }
          : e
      )
    );
  };
  const customBG = useColorModeValue('whiteAlpha.400', 'blackAlpha.400');
  const updatePort = (
    field: string,
    newPort: string | number,
    edgeID: string
  ) => {
    setEdges((prev) =>
      prev.map((e) =>
        e.id === edgeID
          ? {
              ...e,
              data: {
                ...e.data,
                [field]: newPort,
              },
            }
          : e
      )
    );
  };
  return (
    <Panel style={{ margin: 8 }} position='top-right'>
      {!!vlanPath && highlight === 'path' && (
        <Box
          p={2}
          border='1px solid'
          borderColor='gray.300'
          borderRadius='lg'
          bg={customBG}
          style={{
            backdropFilter: 'blur(25px)',
          }}
          boxShadow='md'
          w='225px'
        >
          {/* Header */}
          <Flex justify='space-between' align='center' mb={2}>
            <Flex cursor='pointer' onClick={onToggle} gap={1} align='center'>
              <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
                <ChevronUpIcon aria-label='Editar' />
              </motion.div>
              <Text fontWeight='semibold' fontSize='sm' color={lowGray}>
                Tramo seleccionado
              </Text>
            </Flex>

            <IconButton
              icon={<CloseIcon boxSize={2.5} />}
              aria-label='Cerrar'
              size='xs'
              variant='ghost'
              onClick={removeTramo}
            />
          </Flex>
          <Collapse in={isOpen}>
            <Menu>
              <MenuButton
                size='xs'
                mx={1}
                w='200px'
                maxW='90%'
                mb={2}
                borderRadius='md'
                borderColor='gray.300'
                colorScheme='blue'
                variant='outline'
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Tipo de línea
              </MenuButton>
              <MenuList>
                {lineTypes.map((lineT) => (
                  <MenuItem
                    key={lineT}
                    onClick={() => updateEdges(lineT)}
                    icon={
                      <Box as='span' display='inline-block' mr='8px'>
                        {lineIcons[lineT]}
                      </Box>
                    }
                  >
                    {lineT}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Nombres */}
            <Flex gap={1} align='center' wrap='wrap' mb={2}>
              <Tooltip label={selectedSourceNode?.nombre} hasArrow>
                <Badge
                  colorScheme='blue'
                  overflow='hidden'
                  noOfLines={1}
                  whiteSpace='nowrap'
                  fontSize='xs'
                  px={2}
                  py={0.5}
                  borderRadius='md'
                >
                  {selectedSourceNode?.nombre}
                </Badge>
              </Tooltip>

              <ArrowForwardIcon boxSize={3} />

              <Tooltip label={selectedTargetNode?.nombre} hasArrow>
                <Badge
                  colorScheme='green'
                  overflow='hidden'
                  noOfLines={1}
                  whiteSpace='nowrap'
                  fontSize='xs'
                  px={2}
                  py={0.5}
                  borderRadius='md'
                >
                  {selectedTargetNode?.nombre}
                </Badge>
              </Tooltip>
            </Flex>

            {/* VLANs en el tramo */}
            <Text fontSize='xs' fontWeight='medium' mb={1} color={lowGray}>
              VLANs
            </Text>

            <Flex direction='column' gap={1}>
              {selectedEdges?.map((e) => (
                <SelectedEdgeCard
                  editing={editingVlan === e.data.vlan}
                  onToggle={() =>
                    setEditingVlan((prev) =>
                      prev === e.data.vlan ? null : e.data.vlan
                    )
                  }
                  e={e}
                  key={e.id}
                  removeEdge={removeEdge}
                  updatePort={(field: string, newPort: string | number) =>
                    updatePort(field, newPort, e.id)
                  }
                />
              ))}

              {selectedEdges?.length === 0 && (
                <Text fontSize='xs' color='gray.500' mt={1}>
                  No hay VLANs conectadas.
                </Text>
              )}
            </Flex>
          </Collapse>
        </Box>
      )}
    </Panel>
  );
};

export default ReactFlowPathPanel;
