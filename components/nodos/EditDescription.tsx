import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  HStack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditDescription = ({
  description,
  EditDescription,
}: {
  description: string[];
  EditDescription: (newDescription: string[]) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [localDesc, setLocalDesc] = useState(description);
  const cancel = () => {
    setLocalDesc(description);
    setEditing(false);
  };
  const toast = useToast();
  const hasDescription = !!(description + '');
  const handleSave = () => {
    if (localDesc + '' === description + '') {
      toast({
        title: 'Sin cambios',
        description: 'Debes realizar algún cambio en la descripción',
        isClosable: true,
        duration: 3000,
        status: 'info',
      });
      return;
    }
    EditDescription(localDesc);
    setEditing(false);
  };
  return (
    <FormControl transition='0.3s linear'>
      <Flex alignItems='center'>
        <Text>
          <b>Descripción</b>
        </Text>
        {!editing && (
          <EditIcon
            mx={2}
            onClick={() => setEditing(true)}
            _hover={{ opacity: 0.7 }}
            cursor='pointer'
          />
        )}
      </Flex>
      {editing ? (
        <Flex mb={2} flexDir='column' gap={2}>
          <Textarea
            value={localDesc.join('\n')}
            h={100}
            size='sm'
            borderRadius='md'
            placeholder='Ingresar descripción'
            onChange={(e) => setLocalDesc(e.target.value.split('\n'))}
            rows={6}
          />

          <HStack justify='flex-end'>
            <Button size='xs' onClick={cancel} variant='ghost'>
              Cancelar
            </Button>
            <Button size='xs' colorScheme='blue' onClick={handleSave}>
              Guardar
            </Button>
          </HStack>
        </Flex>
      ) : (
        <Flex p={1} direction='column'>
          {hasDescription &&
            description.map((line, idx) => (
              <Text key={idx} fontSize='sm'>
                {line || <br />}
              </Text>
            ))}
          {!hasDescription && (
            <Text fontSize='sm' color='gray.500'>
              No hay descripción
            </Text>
          )}
        </Flex>
      )}
    </FormControl>
  );
};

export default EditDescription;
