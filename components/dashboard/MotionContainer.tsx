import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

const MotionContainer = ({
  customKey,
  children,
  loading,
}: {
  customKey: string;
  children: ReactNode;
  loading?: boolean;
}) => {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={customKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loading ? 0.45 : 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MotionContainer;
