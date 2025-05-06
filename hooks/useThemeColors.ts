import { useColorModeValue } from '@chakra-ui/react';

export const useThemeColors = () => {
  return {
    loadingColor: useColorModeValue('#333c87', '#7EC1D8'),
    brandColorLigth: useColorModeValue('#2D3748', '#fff'),
    brandColorDark: useColorModeValue('#fff', '#2D3748'),
    textColor: useColorModeValue('#000', '#fff'),
    invertedTextColor: useColorModeValue('#fff', '#000'),
    // Agregás más colores como necesites
  };
};
