import { Estados, MovimientosType, PedidoType } from '@/types/types';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PedidoBody from './PedidoBody';
import { useState } from 'react';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { formatearFecha } from '@/helpers/movimientos/formatearFecha';
const PedidosRealTimeCard = ({
  pedido,
  loading,
  data,
  delay,
}: {
  pedido: PedidoType;
  loading: boolean;
  data: PedidoType[];
  delay: number;
}) => {
  const { id } = pedido;
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const toast = useToast();
  const updatePedido = async (id: string) => {
    if (pedido.estado === 'Finalizado') return;
    const fecha = formatearFecha(id);
    const newEstado = Estados[Estados.indexOf(pedido.estado) + 1];
    setLoadingUpdate(true);
    const movimientoFetched = (await getSingleDoc(
      'movimientos',
      fecha
    )) as MovimientosType;
    const updatedReservas = (id: string, arr: PedidoType[]) => {
      const newReservas = arr.map((r) => {
        if (r.id === id) return { ...r, estado: newEstado };
        return r;
      });
      return newReservas;
    };
    try {
      await setSingleDoc('movimientos', fecha, {
        reservas: updatedReservas(id, movimientoFetched.reservas),
      });
      await setSingleDoc('movimientos', 'enCurso', {
        reservas:
          newEstado === 'Finalizado'
            ? data.filter((d) => d.id !== id)
            : updatedReservas(id, data),
      });
      toast({
        title: 'Éxito',
        description: 'Pedido actualizado con éxito',
        isClosable: true,
        duration: 5000,
        status: 'success',
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingUpdate(false);
    }
  };
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid gray',
        padding: 8,
        borderRadius: 20,
        width: '500px',
        maxWidth: '100%',
      }}
      initial={{ opacity: 0, x: 150 }}
      exit={{ opacity: 0, x: -150 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'tween', delay }}
    >
      <Flex justify='space-between'>
        <Text fontSize={14} fontStyle='italic'>
          ID: {id}
        </Text>
      </Flex>
      <PedidoBody size='inicio' pedido={pedido} loading={loading} />
      <Flex gap={2}>
        <Button
          bg='blue.700'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
          onClick={() => updatePedido(id)}
          isLoading={loadingUpdate}
        >
          Actualizar
        </Button>
        <Button
          as={Link}
          href={`/PedidosID/${id}`}
          target='_blank'
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          _hover={{ opacity: 0.65 }}
        >
          Ver Pedido
        </Button>
      </Flex>
    </motion.div>
  );
};

export default PedidosRealTimeCard;
