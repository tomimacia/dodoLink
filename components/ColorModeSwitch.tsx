import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1.2, 1.1, 1] }}
      transition={{ type: 'tween' }}
      key={colorMode}
      style={{ marginRight: 5 }}
    >
      <IconButton
        aria-label='switch-icon'
        icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        outlineColor={'gray.300'}
        cursor='pointer'
        fontSize={18}
        mr={2}
        size='sm'
        color='white'
        _hover={{
          color: 'whiteAlpha.700',
        }}
        bg='transparent'
      >
        Switch Mode
      </IconButton>
    </motion.div>
  );
};

export default ColorModeSwitch;
