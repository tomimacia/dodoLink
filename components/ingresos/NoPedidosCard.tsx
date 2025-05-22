import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@chakra-ui/react';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
const NoPedidosCard = ({ title }: { title: string }) => {
  const { user } = useUser();
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
      <Heading size='sm'>
        No hay {title} {CheckAdminRol(user?.rol) ? 'en curso' : 'pendientes'}
      </Heading>
    </motion.div>
  );
};

export default NoPedidosCard;
