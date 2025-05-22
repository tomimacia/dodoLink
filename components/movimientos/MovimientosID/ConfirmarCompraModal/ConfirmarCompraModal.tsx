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
import ModalFooterComp from '../ConfimarPedidoModal/ModalFooterComp';
import CompraModalBottomPart from './CompraModalBottomPart';
import CompraModalTopPart from './CompraModalTopPart';

const ConfirmarCompraModal = ({
  loading,
  update,
  pedido,
}: {
  loading: boolean;
  update: (newPedido: PedidoType, onClose: () => void) => Promise<void>;
  pedido: PedidoType;
}) => {
  const { id, movimientos, confirmedItems } = pedido;
  const estado = getEstado(movimientos);
  const [items, setItems] = useState<ProductoType[]>(
    pedido.items.map((p) => {
      return { ...p, isChecked: false };
    })
  );
  const [cliente, setCliente] = useState(pedido.cliente);
  const [detalle, setDetalle] = useState(pedido.detalle);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = async () => {
    const toUpdate = items.filter(
      (i) => i.isChecked && !confirmedItems?.some((ci) => ci.id === i.id)
    );
    if (toUpdate.every((i) => !i.isChecked)) {
      toast({
        title: 'Error',
        description: `Debes marcar algún producto`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newPedido: PedidoType = {
      ...pedido,
      cliente,
      detalle,
      items,
    };

    await update(newPedido, onClose);
  };
  const toast = useToast();
  const handleClose = () => {
    setCliente(pedido.cliente);
    setDetalle(pedido.detalle);
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
            Confirmar pedido #{id}
          </ModalHeader>
          <Divider />
          <ModalBody py={4}>
            <CompraModalTopPart estado={estado} />
            <Divider my={3} />
            <CompraModalBottomPart
              confirmedItems={confirmedItems}
              estado={estado}
              itemsHandler={[items, setItems]}
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

export default ConfirmarCompraModal;
