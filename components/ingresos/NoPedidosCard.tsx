import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@chakra-ui/react';
const NoPedidosCard = ({ title }: { title: string }) => {
  return (
    <motion.div
      key={'no-client'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        marginRight: 10,
        borderRadius: 20,
      }}
      initial={{ opacity: 0, x: 150 }}
      exit={{ opacity: 0, x: -150 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'tween' }}
    >
      <Heading size='sm'>No hay {title} en curso</Heading>
    </motion.div>
  );
};

export default NoPedidosCard;
