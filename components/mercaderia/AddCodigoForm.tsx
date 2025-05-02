import { useEnter } from '@/hooks/eventHooks/useEnter';
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';

const AddCodigoForm = ({
  addCodigo,
  adding,
  setAdding,
}: {
  addCodigo: (newCodigo: number) => void;
  adding: boolean;
  setAdding: Dispatch<SetStateAction<boolean>>;
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>(null);
  const submit = () => {
    if (!inputValue) return;
    addCodigo(Number(inputValue));
    setInputValue('');
  };
  const onKeyDown = useEnter(inputRef, submit);
  return (
    <>
      {adding && (
        <Flex my={1} align='center' gap={1}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            type='number'
            ref={inputRef}
            required
            onKeyDown={onKeyDown}
            autoComplete='off'
            formNoValidate
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
                setAdding(false);
                setInputValue('');
              }}
            />
          </Flex>
        </Flex>
      )}
      <IconButton
        w='fit-content'
        p={0}
        color='white'
        bg='gray.700'
        size='xs'
        _hover={{ opacity: 0.65 }}
        my={2}
        onClick={() => setAdding(true)}
        aria-label='plus-codigo'
        icon={<AddIcon />}
      />
    </>
  );
};

export default AddCodigoForm;
