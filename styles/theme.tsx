import { theme as chakraTheme, extendTheme } from '@chakra-ui/react';
import '@fontsource/montserrat/400.css';
import '@fontsource/roboto-mono/400.css';
const fonts = {
  heading: `'montserrat', 'roboto-mono'`,
  body: `'montserrat', 'roboto-mono'`,
};
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};
const colors = {
  lightBrand: '#b81216',
  brandDark: '#CD5C5C',
  darkBlue: 'blue.700',
  darkGray: '#495568',
};
const breakpoints = {
  xs: '24em',
  sm: '40em',
  md: '52em',
  lg: '62em',
  xl: '64em',
};
const fontWeights = {
  normal: 300,
  medium: 600,
  bold: 700,
};
const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '64px',
};
const styles = {
  global: {
    body: {
      margin: 0,
      padding: 0,
    },
    html: {
      margin: 0,
      padding: 0,
    },
  },
};
const overrides = {
  ...chakraTheme,
  fonts,
  breakpoints,
  fontWeights,
  fontSizes,
  config,
  colors,
  styles,
};

export const customTheme = extendTheme(overrides);
