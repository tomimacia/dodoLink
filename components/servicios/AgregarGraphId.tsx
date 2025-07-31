import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { getDateRangeFromLapso } from '@/helpers/getDateFrangeFromLapso';
import { ServicioFirebaseType } from '@/types/types';
import { Button, Flex, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';

const AgregarGraphId = ({
  servicio,
  setServicio,
  setGraphImageState,
}: {
  servicio: ServicioFirebaseType;
  setServicio: Dispatch<SetStateAction<ServicioFirebaseType>>;
  setGraphImageState: Dispatch<SetStateAction<string[]>>;
}) => {
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [inputGraphId, setInputGraphId] = useState('');
  const toast = useToast();
  const asignarGraphId = async () => {
    if (!inputGraphId) {
      toast({
        title: 'ID de gráfico requerido',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (servicio.graphId.includes(inputGraphId)) {
      toast({
        title: 'Ya asignado',
        description: `El Graph ID "${inputGraphId}" ya está cargado`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setInputGraphId('');
      return;
    }

    setLoadingGraph(true);
    try {
      const { from, to } = getDateRangeFromLapso('1h');
      const res = await axios.post('/api/zabbix/graph', {
        graphid: inputGraphId,
        from,
        to,
      });

      const newGraphs = [...servicio.graphId, inputGraphId];

      await setSingleDoc('servicios', servicio.id, {
        ...servicio,
        graphId: newGraphs,
      });

      setServicio((prev) => ({
        ...prev,
        graphId: newGraphs,
      }));

      setGraphImageState((prev) => [...prev, res.data.imageBase64]);

      toast({
        title: 'Agregado',
        description: 'Gráfico agregado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setInputGraphId('');
    } catch (err) {
      toast({
        title: 'Error al asignar gráfico',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingGraph(false);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        asignarGraphId();
      }}
    >
      <Flex flexDir='column' gap={2} p={2}>
        <Button
          size='sm'
          colorScheme='blue'
          isLoading={loadingGraph}
          loadingText='Asignando'
          maxW='fit-content'
          variant='outline'
          type='submit'
        >
          Agregar Graph ID
        </Button>
        <Input
          placeholder='Ingresá el ID del gráfico de Zabbix'
          size='sm'
          maxW='300px'
          type='number'
          value={inputGraphId}
          onChange={(e) => setInputGraphId(e.target.value)}
        />
      </Flex>
    </form>
  );
};

export default AgregarGraphId;
