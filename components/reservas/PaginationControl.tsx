import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { IconButton, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
const PaginationControl = ({
  page,
  totalPages,
  handlePageChange,
  show,
}: {
  page: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
  show: boolean;
}) => {
  if (!show) return null;
  return (
    <motion.div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '300px',
        justifyContent: 'space-between',
        fontSize: '1rem',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '6px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'tween',
        delay: 0.3,
      }}
    >
      <IconButton
        size='sm'
        as={ArrowBackIcon}
        aria-label='back-icon'
        onClick={() => {
          if (page > 0) {
            handlePageChange(page - 1);
          }
        }}
        isDisabled={page <= 0}
        cursor='pointer'
        _hover={{
          opacity: 0.65,
        }}
      />

      <Text>
        Página {page + 1} de {totalPages}
      </Text>
      <IconButton
        size='sm'
        as={ArrowForwardIcon}
        aria-label='next-icon'
        onClick={() => {
          if (page < totalPages - 1) {
            handlePageChange(page + 1);
          }
        }}
        isDisabled={page >= totalPages - 1}
        cursor='pointer'
        _hover={{
          opacity: 0.65,
        }}
      />
    </motion.div>
  );
};

export default PaginationControl;
