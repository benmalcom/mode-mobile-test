'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import type React from 'react';

import { ChakraProvider } from '~/lib/providers/chakra-provider';

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
};
