import { HighlightType, VLANType } from '@/types/types';
import { ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Panel } from 'reactflow'; // Usamos 'reactflow' en vez de 'react-flow-renderer'
import EditDescription from '../../EditDescription';
const ReactFlowVlanPanel = ({
  vlan,
  highlight,
  removeVlan,
  deleteVlan,
  editVlan,
  tramosTotales,
}: {
  vlan: VLANType | null;
  highlight: HighlightType;
  removeVlan: () => void;
  deleteVlan: (VLAN: VLANType) => void;
  editVlan: (VLAN: VLANType) => void;
  tramosTotales: number;
}) => {
  const customBG = useColorModeValue('whiteAlpha.400', 'blackAlpha.400');
  const customGray = useColorModeValue('gray.500', 'gray.300');
  const { nombre, description } = vlan ?? {};
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const EditDescriptionFunc = (newDescription: string[]) => {
    if (!vlan) return;
    const newVlan = { ...vlan, description: newDescription };
    editVlan(newVlan);
  };

  return (
    <Panel style={{ margin: 8 }} position='top-right'>
      {!!vlan && highlight === 'vlan' && (
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
          <Flex justify='space-between' align='center'>
            <Flex cursor='pointer' onClick={onToggle} gap={1} align='center'>
              <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
                <ChevronUpIcon aria-label='Editar' />
              </motion.div>
              <Text fontSize='xs'>
                <b>VLAN</b>
              </Text>
              <Tooltip label={nombre} hasArrow>
                <Badge
                  colorScheme='blue'
                  fontSize='xs'
                  px={2}
                  borderRadius='md'
                  maxW='120px' // ajustalo a tu diseño
                  whiteSpace='nowrap'
                  overflow='hidden'
                  textOverflow='ellipsis'
                >
                  {nombre}
                </Badge>
              </Tooltip>
            </Flex>

            <Flex gap={1}>
              <IconButton
                icon={<CloseIcon boxSize={2.5} />}
                aria-label='Cerrar'
                size='xs'
                variant='ghost'
                onClick={removeVlan}
              />
            </Flex>
          </Flex>
          <Collapse in={isOpen}>
            <Flex gap={3} mt={2} direction='column'>
              <Flex flexDir='column'>
                <Text fontWeight='bold'>Tramos Totales</Text>
                <Text
                  fontSize='sm'
                  color={tramosTotales ? undefined : customGray}
                  px={1}
                >
                  {tramosTotales ? tramosTotales : 'Sin tramos'}
                </Text>
              </Flex>
              <EditDescription
                description={description || []}
                EditDescription={EditDescriptionFunc}
              />

              <Button
                w='fit-content'
                size='xs'
                colorScheme='red'
                variant='outline'
                onClick={() => deleteVlan(vlan)}
              >
                Eliminar VLAN
              </Button>
            </Flex>
          </Collapse>
        </Box>
      )}
    </Panel>
  );
};

export default ReactFlowVlanPanel;
