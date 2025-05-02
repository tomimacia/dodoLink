import PaginationControl from '@/components/clientes/PaginationControl';
import usePagination from '@/hooks/data/usePagination';
import { ClientType } from '@/types/types';
import {
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Switch,
  Text,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ClientesModalListItem from './ClientesModalListItem';
const ClientesModal = ({
  isOpen,
  onClose,
  modalData,
}: {
  isOpen: boolean;
  onClose: () => void;
  modalData: { title: string; list: ClientType[] };
}) => {
  const [conDeuda, setConDeuda] = useState(false);
  const itemsPerPage = 10;
  const filterClientes = (clientes: ClientType[]) => {
    if (conDeuda) return clientes.filter((c) => c.saldo !== 0);
    return clientes;
  };
  const clientesFinal = filterClientes(modalData?.list || []);
  const { page, goingUp, totalPages, paginatedClients, handlePageChange } =
    usePagination(clientesFinal, itemsPerPage);
  const isSaldo = modalData.title.split(' ')[0] === 'Saldo';
  const handleClose = () => {
    setConDeuda(false);
    onClose();
  };

  return (
    <Modal
      size={['xl', '2xl', '3xl', '3xl']}
      isCentered
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          zIndex={10}
          _hover={{ bg: 'blackAlpha.400' }}
          bg='blackAlpha.200'
        />
        <ModalBody minH='368px'>
          <Heading fontSize='lg'>{modalData.title}</Heading>
          <Divider w='95%' borderColor='gray' mt={1} />
          <Flex justify='center'>
            <PaginationControl
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              show={modalData?.list?.length > itemsPerPage}
            />
          </Flex>
          {!isSaldo && (
            <Flex gap={1} align='center'>
              <Text>Con Saldo</Text>
              <Switch
                isChecked={conDeuda}
                onChange={() => setConDeuda((prev) => !prev)}
              />
            </Flex>
          )}
          <AnimatePresence mode='wait'>
            <motion.div
              key={`custom-key-pagination-${page}-${conDeuda ? 'cd' : 'sd'}`}
              style={{
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
              }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: goingUp ? 15 : -15, opacity: 0 }}
              exit={{ x: goingUp ? -15 : 15, opacity: 0 }}
            >
              {paginatedClients.map((c: ClientType) => {
                return (
                  <ClientesModalListItem
                    key={`clientes-modal-key-${c.id}${c?.vencimiento?.seconds}`}
                    isSaldo={isSaldo}
                    c={c}
                  />
                );
              })}
              {paginatedClients.length === 0 && (
                <Text fontStyle='italic'>No hay clientes para mostrar</Text>
              )}
            </motion.div>
          </AnimatePresence>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ClientesModal;
