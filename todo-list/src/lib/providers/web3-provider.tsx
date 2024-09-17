import type { ReactNode } from 'react';
import { useMemo, createContext, useContext } from 'react';
import type { Connector } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface Web3AuthContextType {
  connect: (connector: Connector) => void;
  disconnect: () => void;
  isConnected: boolean;
  address: string | undefined;
  error: Error | null;
  connectors: readonly Connector[];
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(
  undefined
);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  const value = useMemo(
    () => ({
      connect: (connector: Connector) => connect({ connector }),
      disconnect,
      isConnected,
      address,
      error,
      connectors,
    }),
    [address, connect, connectors, disconnect, error, isConnected]
  );

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}
