import {
  Flex,
  IconButton,
  Input,
  Progress,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import ShowHidePassword from '../users/ShowHidePassword';
import useGetAdminPassword from '@/hooks/users/useGetAdminPassword';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useEnter } from '@/hooks/eventHooks/useEnter';

const HandlePassword = () => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { password, updatePassword, loadingPassword } = useGetAdminPassword();
  const inputRef = useRef<any>(null);
  const toast = useToast();
  const submit = async () => {
    if (inputValue.length < 6) {
      return toast({
        title: 'Contraseña incorrecta',
        description: 'La contraseña debe tener al menos 6 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    try {
      await updatePassword(inputValue);
      toast({
        title: 'Contraseña cambiada',
        description: 'La contraseña se ha cambiado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setEditing(false);
    } catch (e) {
      console.log(e);
    }
  };
  const onKeyDown = useEnter(inputRef, submit);

  if (loadingPassword) {
    return (
      <Progress
        h={2}
        my={4}
        alignSelf='center'
        colorScheme='blue'
        bg='transparent'
        w='100%'
        isIndeterminate
      />
    );
  }

  return (
    <Flex align='center' justify='space-between' gap={2}>
      <Text noOfLines={1}>Contraseña Admin:</Text>
      <Flex>
        {editing ? (
          <Flex gap={2}>
            <Input
              onChange={(e) => setInputValue(e.target.value)}
              borderColor='gray.300'
              size='sm'
              autoComplete='off'

              formNoValidate
              ref={inputRef}
              onKeyDown={onKeyDown}
              borderRadius={5}
              autoFocus
              placeholder='Nueva contraseña'
            />
            <Flex gap={1}>
              <IconButton
                bg='green.600'
                color='white'
                size='sm'
                onClick={submit}
                aria-label='checkicon'
                icon={<CheckIcon />}
                _hover={{ opacity: 0.65 }}
              />
              <IconButton
                bg='red.600'
                color='white'
                size='sm'
                aria-label='closeicon'
                icon={<CloseIcon />}
                _hover={{ opacity: 0.65 }}
                onClick={() => {
                  setEditing(false);
                  setInputValue('');
                }}
              />
            </Flex>
          </Flex>
        ) : (
          <Flex>
            <ShowHidePassword password={password || ''} />
            <IconButton
              bg='transparent'
              size='sm'
              onClick={() => setEditing(true)}
              aria-label='editbutton'
              icon={<EditIcon />}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default HandlePassword;
