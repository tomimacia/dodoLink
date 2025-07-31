import { getDateRangeFromLapso } from '@/helpers/getDateFrangeFromLapso';
import {
  Button,
  Flex,
  Image,
  Select,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Text,
  ModalFooter,
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
const GraphIdComp = ({
  graphId,
  img,
  color,
  eliminarGraphId,
}: {
  graphId: string;
  img: string;
  color: string;
  eliminarGraphId: (s: string) => Promise<void>;
}) => {
  const [graphImage, setGraphImage] = useState(img);
  const [lapso, setLapso] = useState('1h');
  const [loadingGraph, setLoadingGraph] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const actualizarGraphImage = async (newLapso: string) => {
    try {
      const { from, to } = getDateRangeFromLapso(newLapso);
      // Llamada a la API para obtener el gráfico
      const res = await axios.post('/api/zabbix/graph', {
        graphid: graphId,
        from,
        to,
      });

      // Actualizar el estado del gráfico con la nueva imagen
      setGraphImage(res.data.imageBase64);
    } catch (err) {
      console.error('Error al actualizar gráfico:', err);
    }
  };
  const handleDelete = async (graph: string) => {
    setLoadingGraph(true);
    try {
      await eliminarGraphId(graph);
      toast({
        title: 'Eliminado',
        description: 'El graph ID ha sido eliminado.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error al eliminar gráfico',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingGraph(false);
    }
  };
  return (
    <Flex
      boxShadow='0 0 3px'
      p={2}
      borderRadius='md'
      direction='column'
      gap={4}
    >
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader p={3}>Eliminar Graph ID</ModalHeader>
          <ModalBody>
            <Text>¿Quieres eliminar el graph {`"${graphId}"`} ?</Text>
          </ModalBody>
          <ModalFooter>
            <Flex justify='flex-end' mt={4} gap={3}>
              <Button
                isDisabled={loadingGraph}
                size='sm'
                onClick={onClose}
                variant='ghost'
              >
                Cancelar
              </Button>
              <Button
                isLoading={loadingGraph}
                isDisabled={loadingGraph}
                size='sm'
                onClick={() => handleDelete(graphId)}
                colorScheme='red'
              >
                Eliminar
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text fontStyle='italic' fontSize='sm'>
        Graph ID <b>#{graphId}</b>
      </Text>
      <Select
        cursor='pointer'
        size='sm'
        maxW='200px'
        value={lapso}
        onChange={(e) => {
          setLapso(e.target.value);
          actualizarGraphImage(e.target.value);
        }}
      >
        <option value='1h'>Última hora</option>
        <option value='4h'>Últimas 4 horas</option>
        <option value='12h'>Últimas 12 horas</option>
        <option value='1d'>Último día</option>
        <option value='2d'>Últimos 2 días</option>
        <option value='4d'>Últimos 4 días</option>
        <option value='7d'>Últimos 7 días</option>
      </Select>
      <motion.div
        key={graphImage} // fuerza la animación cuando cambia la imagen
        initial={{ boxShadow: '0 0 0px rgba(0, 122, 255, 0)' }}
        animate={{
          boxShadow: [
            `0 0 0px ${color}`,
            `0 0 20px ${color}`,
            `0 0 0px ${color}`,
          ],
        }}
        transition={{ duration: 1.5 }}
      >
        <Image
          w='100%'
          src={graphImage}
          alt={`Gráfico ${graphId}`}
          borderRadius='md'
          boxShadow='md'
        />
      </motion.div>
      <Button
        size='xs'
        colorScheme='red'
        variant='outline'
        w='fit-content'
        onClick={onOpen}
      >
        Eliminar gráfico
      </Button>
    </Flex>
  );
};

export default GraphIdComp;
