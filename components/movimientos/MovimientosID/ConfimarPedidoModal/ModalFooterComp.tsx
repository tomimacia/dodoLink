import { Button, Flex, useColorModeValue } from '@chakra-ui/react';

const ModalFooterComp = ({
  handleClose,
  handleUpdate,
  loading,
}: {
  loading: boolean;
  handleClose: () => void;
  handleUpdate: () => Promise<void>;
}) => {
  const fontColor = useColorModeValue('red.700', 'red.600');

  return (
    <Flex justify='center' gap={4} w='100%'>
      <Button
        bg='blue.700'
        color='white'
        w='fit-content'
        isLoading={loading}
        _hover={{ opacity: 0.8 }}
        onClick={handleUpdate}
      >
        Confirmar
      </Button>
      <Button
        bg={fontColor}
        color='white'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        onClick={handleClose}
      >
        Cancelar
      </Button>
    </Flex>
  );
};

export default ModalFooterComp;
