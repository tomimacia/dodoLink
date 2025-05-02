import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
const MotionButton = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }}>
      {children}
    </motion.div>
  );
};

export default MotionButton;
