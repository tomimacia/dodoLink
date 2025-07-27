import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Collapse,
  Flex,
  Heading,
  HStack,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditTitle = ({
  title,
  fontSize,
  confirm,
}: {
  title: string;
  fontSize?: string;
  confirm: (newTitle: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const cancel = () => {
    setLocalTitle(title);
    setEditing(false);
  };

  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const hasTitle = !!title;
  const isEditing = editing || !hasTitle;
  const handleConfirm = (e: any) => {
    e.preventDefault();
    confirm(localTitle);
    setEditing(false);
  };
  return (
    <form onSubmit={handleConfirm}>
      <Flex
        boxShadow='md'
        borderRadius='md'
        p={3}
        mb={2}
        direction='column'
        gap={1}
      >
        {isEditing ? (
          <>
            <Input
              placeholder='Ingresar título'
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              bg={inputBg}
              autoFocus
            />
          </>
        ) : (
          <Flex align='center' gap={2}>
            <Heading fontSize={fontSize || '2xl'} transition='0.3s linear'>
              {title}
            </Heading>
            <EditIcon
              onClick={() => setEditing(true)}
              _hover={{ opacity: 0.7 }}
              cursor='pointer'
            />
          </Flex>
        )}
        <Collapse in={editing}>
          <HStack justify='flex-end' pt={2}>
            <Button size='sm' onClick={cancel} variant='ghost'>
              Cancelar
            </Button>
            <Button type='submit' size='sm' colorScheme='blue'>
              Guardar
            </Button>
          </HStack>
        </Collapse>
      </Flex>
    </form>
  );
};

export default EditTitle;
