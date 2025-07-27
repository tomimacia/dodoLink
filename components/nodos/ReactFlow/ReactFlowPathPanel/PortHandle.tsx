import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const PortHandle = ({
  data,
  field,
  updatePort,
}: {
  data: {
    sourcePort: number | null;
    targetPort: number | null;
  };
  field: 'sourcePort' | 'targetPort';
  updatePort: (field: string, newPort: string | number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const selectedData = data[field];
  const toast = useToast();
  const title = {
    sourcePort: 'Source',
    targetPort: 'Target',
  };
  const selectedTitle = title[field];
  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!inputValue) {
      toast({
        title: 'Error',
        description: 'Hubo un error al confirmar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    updatePort(field, Number(inputValue) || inputValue);
    setEditing(false);
  };
  const customGray = useColorModeValue('gray.500', 'gray.300');
  return (
    <Flex
      flex='1'
      direction='column'
      border='1px solid'
      borderColor='gray.100'
      borderRadius='md'
      p={2}
      position='relative'
    >
      <Text fontSize='sm' mb={1}>
        {selectedTitle}
      </Text>

      {editing ? (
        <Flex flexDir='column'>
          <form onSubmit={handleSave}>
            <Input
              size='xs'
              autoFocus
              placeholder='Puerto'
              border='1px solid #BEBEBE'
              type='number'
              borderRadius='md'
              defaultValue={selectedData ?? ''}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Flex py={1} justify='space-around'>
              <IconButton
                size='2xs'
                h='20px'
                w='20px'
                fontSize='8px'
                icon={<CloseIcon />}
                aria-label='Cancelar'
                bg='red.400'
                onClick={() => {
                  setEditing(false);
                  setInputValue('');
                }}
              />
              <IconButton
                size='2xs'
                h='20px'
                w='20px'
                fontSize='8px'
                aria-label='Guardar'
                bg='green.400'
                type='submit'
                icon={<CheckIcon />}
              />
            </Flex>
          </form>
        </Flex>
      ) : (
        <Text
          color={!!selectedData ? undefined : customGray}
          fontStyle={!!selectedData ? undefined : 'italic'}
          fontSize='sm'
        >
          {selectedData ? <b>{selectedData}</b> : 'No port'}
        </Text>
      )}

      <IconButton
        icon={<EditIcon boxSize={2.5} />}
        size='xs'
        variant='ghost'
        colorScheme='blue'
        aria-label={`Editar ${selectedTitle} Port`}
        position='absolute'
        top='2px'
        right='2px'
        onClick={() => {
          setEditing((prev) => !prev);
        }}
      />
    </Flex>
  );
};

export default PortHandle;
