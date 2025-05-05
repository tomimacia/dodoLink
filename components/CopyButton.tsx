import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Icon, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
const CopyButton = ({
  content,
  description,
}: {
  content: string;
  description: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentKey, setCurrentKey] = useState(0);
  const toast = useToast();
  const handleClick = () => {
    setCurrentKey((prev) => prev + 1);
    navigator?.clipboard?.writeText(content);
    if (!isCopied) {
      toast({
        title: 'Copiado',
        description: description,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsCopied(true);
  };
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  }, [isCopied]);
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        key={`copybutton-${currentKey}${
          isCopied ? 'copieado' : 'nocopiado'
        }-${content}`}
      >
        <Icon
          cursor='pointer'
          color={isCopied ? 'green' : 'gray'}
          as={isCopied ? CheckIcon : CopyIcon}
          onClick={handleClick}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CopyButton;
