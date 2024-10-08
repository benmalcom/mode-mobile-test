'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { type State, WagmiProvider } from 'wagmi';

import { ChakraProvider } from '~/lib/providers/chakra-provider';
import { Web3AuthProvider } from '~/lib/providers/web3-provider';
import { config } from '~/lib/utils/wagmi-config';

const queryClient = new QueryClient();

export const RootProviders = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: State | undefined;
}) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <Web3AuthProvider>{children}</Web3AuthProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
