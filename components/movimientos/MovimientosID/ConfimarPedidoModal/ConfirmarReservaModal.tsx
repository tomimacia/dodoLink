import { getEstado } from '@/helpers/cobros/getEstado';
import { PedidoType, ProductoType } from '@/types/types';
import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import ModalBodyBottomPart from './ModalBodyBottomPart';
import ModalBodyTopPart from './ModalBodyTopPart';
import ModalFooterComp from './ModalFooterComp';

const ConfirmarReservaModal = ({
  loading,
  update,
  pedido,
  productos,
  volverAInicializado,
  disclosure,
}: {
  loading: boolean;
  update: (
    newPedido: PedidoType,
    newItems: ProductoType[],
    sobrantes: ProductoType[]
  ) => Promise<void>;
  pedido: PedidoType;
  disclosure: any;
  productos: ProductoType[];
  volverAInicializado: (onClose: () => void) => Promise<void>;
}) => {
  const { onOpen, isOpen, onClose } = disclosure;
  const { id, movimientos } = pedido;
  const estado = getEstado(movimientos);
  const [items, setItems] = useState<ProductoType[]>(pedido.items);
  const [sobrantes, setSobrantes] = useState<ProductoType[]>([]);
  const [cliente, setCliente] = useState(pedido.cliente);
  const [detalle, setDetalle] = useState(pedido.detalle.join('\n'));
  const [tramo, setTramo] = useState(pedido.tramo);
  const [mapCoords, setMapCoords] = useState(pedido.mapCoords);

  const [checkedItems, setCheckedItems] = useState(
    pedido.items.map((p) => {
      return { ...p, checked: false };
    })
  );
  const handleUpdate = async () => {
    if (estado === 'Preparación') {
      const unChecked = checkedItems.filter((i: any) => !i.checked);
      if (unChecked.length > 0) {
        toast({
          title: 'Error',
          description: `Tienes productos sin confirmar: ${unChecked
            .map((i: any) => i.nombre)
            .join(', ')}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    if (estado === 'En curso') {
      const deMas = sobrantes.filter((s) => {
        const p = items.find((i) => i.id === s.id);
        return (p?.unidades as number) < s?.cantidad;
      });
      if (deMas.length > 0) {
        toast({
          title: 'Error',
          description: `Incompatibilidad de cantidades: ${deMas
            .map((i) => i.nombre)
            .join(', ')}`,
          isClosable: true,
          duration: 5000,
          status: 'error',
        });
        return;
      }
    }
    const newPedido: PedidoType = {
      ...pedido,
      cliente,
      detalle: detalle.split('\n'),
      tramo,
      items,
      mapCoords,
    };

    await update(newPedido, items, sobrantes);
  };
  const toast = useToast();
  const handleClose = () => {
    setCliente(pedido.cliente);
    setDetalle(pedido.detalle.join('\n'));
    setTramo(pedido.tramo);
    setMapCoords(pedido.mapCoords);
    setItems(pedido.items);
    onClose();
  };
  const handleOpen = () => {
    if (estado === 'Finalizado') {
      toast({
        title: 'Finalizado',
        description: 'No se puede actualizar un pedido finalizado',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };
  const volverAInicializadoFInal = async () => {
    await volverAInicializado(handleClose);
  };
  return (
    <Flex>
      <Button
        bg='blue.700'
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        onClick={handleOpen}
      >
        Confirmar
      </Button>

      <Modal
        size={['xl', '2xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius='2xl' p={2}>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader p={4} fontWeight='bold'>
            Actualización de Pedido #{id}
          </ModalHeader>
          <Divider />
          <ModalBody py={4}>
            <ModalBodyTopPart estado={estado} />
            <Divider my={3} />
            <ModalBodyBottomPart
              productos={productos}
              estado={estado}
              checkedItemsHandler={[checkedItems, setCheckedItems]}
              itemsHandler={[items, setItems]}
              clienteHandler={[cliente, setCliente]}
              detalleHandler={[detalle, setDetalle]}
              tramoHandler={[tramo, setTramo]}
              mapCoordsHandler={[mapCoords, setMapCoords]}
              sobrantesHandler={[sobrantes, setSobrantes]}
              volverAInicializado={volverAInicializadoFInal}
              loading={loading}
              isRetiro={pedido?.isRetiro}
            />
          </ModalBody>
          <ModalFooter>
            <ModalFooterComp
              loading={loading}
              handleClose={handleClose}
              handleUpdate={handleUpdate}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ConfirmarReservaModal;
