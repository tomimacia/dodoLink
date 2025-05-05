import { useColorModeValue } from '@chakra-ui/react';

export const useThemeColors = () => {
  return {
    loadingColor: useColorModeValue('#333c87', '#7EC1D8'),
    brandColor: useColorModeValue('#b81216', '#CD5C5C'),
    textColor: useColorModeValue('#000', '#fff'),
    invertedTextColor: useColorModeValue('#fff', '#000'),
    // Agregás más colores como necesites
  };
};
