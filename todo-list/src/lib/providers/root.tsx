'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { WagmiProvider } from 'wagmi';

import { ChakraProvider } from '~/lib/providers/chakra-provider';
import { Web3AuthProvider } from '~/lib/providers/web3-provider';
import { config } from '~/lib/web3/wagmiConfig';

const queryClient = new QueryClient();

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Web3AuthProvider>{children}</Web3AuthProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
