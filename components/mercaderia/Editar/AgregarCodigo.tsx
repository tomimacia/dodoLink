import { useEnter } from '@/hooks/eventHooks/useEnter';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, IconButton, Input } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';

const AgregarCodigo = ({
  setCodigos,
}: {
  setCodigos: Dispatch<SetStateAction<number[]>>;
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>(null);

  const updateCodigos = (newCodigo: number) => {
    setCodigos((prev) => [...prev, newCodigo]);
  };
  const submit = () => {
    if (!inputValue) return;
    updateCodigos(Number(inputValue));
    setInputValue('');
  };
  const onKeyDown = useEnter(inputRef, submit);
  return (
    <>
      {!editing && (
        <Button
          color='white'
          bg='gray.600'
          w='fit-content'
          _hover={{ opacity: 0.65 }}
          size='sm'
          onClick={() => setEditing(true)}
        >
          Agregar Código
        </Button>
      )}
      {editing && (
        <Flex maxW='400px' my={1} align='center' gap={1}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            type='number'
            ref={inputRef}
            autoComplete='off'
            formNoValidate
            onKeyDown={onKeyDown}
            borderColor='gray'
            placeholder='Ingresar código'
            size='sm'
            borderRadius='5px'
          />
          <Flex gap={1}>
            <IconButton
              bg='green.600'
              color='white'
              size='xs'
              onClick={submit}
              aria-label='checkicon'
              icon={<CheckIcon />}
              _hover={{ opacity: 0.65 }}
            />
            <IconButton
              bg='red.600'
              color='white'
              size='xs'
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
      )}
    </>
  );
};

export default AgregarCodigo;
