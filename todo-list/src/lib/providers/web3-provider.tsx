import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMemo, createContext, useContext } from 'react';
import { useAccount, useConnect, useDisconnect, WagmiProvider } from 'wagmi';

import { config } from '~/lib/web3/wagmiConfig';

interface Web3AuthContextType {
  connect: (connector: never) => void;
  disconnect: () => void;
  isConnected: boolean;
  address: string | undefined;
  error: Error | null;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(
  undefined
);

const queryClient = new QueryClient();

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const value = useMemo(
    () => ({
      connect: (connector: never) => connect({ connector }),
      disconnect,
      isConnected,
      address,
      error,
      connectors,
    }),
    [address, connect, connectors, disconnect, error, isConnected]
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3AuthContext.Provider value={value}>
          {children}
        </Web3AuthContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}
