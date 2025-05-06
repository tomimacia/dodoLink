import { useClickOutside } from '@/hooks/useClickOutside';
import useScanDetection from '@/hooks/useScanDetection';
import { ProductoType } from '@/types/types';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { KeyboardEvent, useCallback, useState } from 'react';

const TitleSearch = ({
  productos,
  extraFunction,
  addProducto,
}: {
  productos: ProductoType[];
  extraFunction?: () => void;
  addProducto: (producto: ProductoType) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const barRef = useClickOutside(() => {
    setInputValue('');
    setShowInput(false);
  });
  const scanCode = (code: String) => {
    if (isNaN(Number(code))) return;
    const productoScanner = productos.find((p) =>
      p?.codigo?.some((c) => c === Number(code))
    );
    if (productoScanner) {
      addProducto(productoScanner);
      setInputValue('');
    }
  };
  useScanDetection({
    onComplete: scanCode,
    minLength: 4,
  });

  const filteredByInput = useCallback(() => {
    if (inputValue.length < 3) return [];
    return productos?.filter(
      (p) =>
        p?.nombre?.toLowerCase().includes(inputValue.toLowerCase()) ||
        p?.codigo?.some((c) => c === Number(inputValue))
    );
  }, [inputValue, productos]);

  const filteredResults = filteredByInput();

  const handleTextClick = (p: any) => {
    addProducto(p);
    setInputValue(''); // Clear input after selection
    setActiveIndex(-1); // Reset active index
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex((prevIndex) =>
        prevIndex < filteredResults.length - 1 ? prevIndex + 1 : 0
      );
    }
    if (e.key === 'ArrowUp') {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredResults.length - 1
      );
    }
    if (e.key === 'Enter') {
      if (activeIndex !== -1) {
        handleTextClick(filteredResults[activeIndex]);
      }
    } else return;
  };
  const handleSearchIconClick = () => {
    setShowInput((prev) => !prev);
    if (extraFunction) extraFunction();
  };
  const inputValueBreakpoints = useBreakpointValue([
    showInput,
    showInput,
    true,
    true,
  ]);
  return (
    <Flex
      ref={barRef} // Attach the ref to the results container
      gap={1}
      align='center'
      display='flex'
      zIndex={2500}
    >
      <IconButton
        aria-label='search-product-button'
        title='Buscar produtos'
        icon={<SearchIcon />}
        _hover={{ opacity: 0.65 }}
        size='sm'
        mx={1}
        w='fit-content'
        onClick={handleSearchIconClick}
        bg='gray.500'
        color='white'
        alignSelf='flex-start'
      />
      <AnimatePresence>
        {inputValueBreakpoints && (
          <motion.div
            initial={{ opacity: 0, width: '0px' }}
            exit={{ opacity: 0, width: '0px' }}
            animate={{ opacity: 1, width: '180px' }}
            style={{ height: '24px', display: 'flex' }}
          >
            <Input
              placeholder='Buscar productos...'
              borderRadius={5}
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              type='text'
              size='sm'
              borderColor='gray'
              alignSelf='center'
              autoComplete='off'
              formNoValidate
              onKeyDown={handleKeyDown} // Handle key events
              autoFocus // Focus input automatically
            />
          </motion.div>
        )}
      </AnimatePresence>
      {inputValue && (
        <Box
          position='absolute'
          top='40px'
          left='0'
          width='fit-content'
          bg='white'
          zIndex={10000}
          boxShadow='md'
          borderRadius='md'
          overflow='hidden'
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((p, index) => (
              <Box
                key={`result-${index}`}
                p={1}
                cursor='pointer'
                onMouseEnter={() => setActiveIndex(index)}
                borderRadius={5}
                bg={index === activeIndex ? 'gray.500' : undefined} // Highlight the active item
                color={index === activeIndex ? 'white' : 'black'}
                onClick={() => handleTextClick(p)}
              >
                <Text>{p.nombre}</Text>
              </Box>
            ))
          ) : (
            <Box p={2}>
              <Text color='black'>
                {inputValue.length < 3
                  ? 'Por lo menos 3 carácteres'
                  : 'No se encontraron resultados'}
              </Text>
            </Box>
          )}
        </Box>
      )}
    </Flex>
  );
};

export default TitleSearch;
