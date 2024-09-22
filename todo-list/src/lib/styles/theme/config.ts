import type { ThemeConfig } from '@chakra-ui/react';

export const config: ThemeConfig = {
  initialColorMode: 'light', // Start in light mode by default
  useSystemColorMode: false, // Do not use the system preference
  disableTransitionOnChange: false, // Keep transitions enabled during mode change
};
