import {
  ChakraProvider as BaseChakraProvider,
  cookieStorageManager,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

import customTheme from '~/lib/styles/theme';

type ChakraProps = {
  children: ReactNode;
};

export const ChakraProvider = ({ children }: ChakraProps) => {
  return (
    <BaseChakraProvider
      colorModeManager={cookieStorageManager}
      theme={customTheme}
      toastOptions={{
        defaultOptions: {
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
        },
      }}
    >
      {children}
    </BaseChakraProvider>
  );
};
