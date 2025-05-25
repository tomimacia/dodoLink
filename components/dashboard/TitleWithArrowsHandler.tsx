import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

const TitleWithArrowsHandler = ({
  loading,
  goPrev,
  goNext,
  title,
}: {
  loading: boolean;
  goPrev: () => void;
  goNext: () => void;
  title: string;
}) => {
  return (
    <Flex align='center' justify='space-between' p={1}>
      <IconButton
        aria-label='button-minus-clientes'
        icon={<ArrowLeftIcon />}
        onClick={goPrev}
        bg='gray.600'
        color='white'
        size='sm'
        _hover={{ opacity: 0.75 }}
        disabled={loading}
      />
      <AnimatePresence mode='wait'>
        {!loading && (
          <motion.div
            key={`label-title-arrows-key-${title}`}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <Heading as='h3' fontSize='xl'>
              {title}
            </Heading>
          </motion.div>
        )}
      </AnimatePresence>
      <IconButton
        aria-label='button-plus-index'
        icon={<ArrowRightIcon />}
        onClick={goNext}
        bg='gray.600'
        color='white'
        size='sm'
        _hover={{ opacity: 0.75 }}
        disabled={loading}
      />
    </Flex>
  );
};

export default TitleWithArrowsHandler;
