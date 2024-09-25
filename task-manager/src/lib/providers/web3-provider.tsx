import type { ConnectErrorType } from '@wagmi/core/src/actions/connect';
import {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import type { Connector } from 'wagmi';
import {
  useConfig,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from 'wagmi';

import { useDefaultChain } from '~/lib/hooks/useDefaultChain';
import { useMessageVerification } from '~/lib/hooks/useMessageVerification';
import { formatConnectErrors } from '~/lib/utils/error';

interface Web3AuthContextType {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connectors: readonly Connector[];
  errorMessage: string | null;
  clearError: () => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(
  undefined
);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  useDefaultChain();
  const { state } = useConfig();
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { isMessageVerified, isSigningMessage, errorMessage, setErrorMessage } =
    useMessageVerification(isConnected, address, signMessageAsync, disconnect);

  const clearError = useCallback(
    () => setErrorMessage(null),
    [setErrorMessage]
  );

  const handleConnect = useCallback(() => {
    clearError();
    if (isPending || isConnected) return;

    const metaMaskConnector = connectors.find(
      (connector) => connector.name === 'MetaMask'
    );
    if (!metaMaskConnector) {
      setErrorMessage('MetaMask not found');
      return;
    }
    connect({ connector: metaMaskConnector });
  }, [
    clearError,
    connect,
    connectors,
    isConnected,
    isPending,
    setErrorMessage,
  ]);

  useEffect(() => {
    if (state.current && state.status === 'disconnected') {
      disconnect();
    }
  }, [disconnect, state]);

  useEffect(() => {
    if (error) {
      setErrorMessage(formatConnectErrors(error as ConnectErrorType));
    }
  }, [error, setErrorMessage]);

  const value = useMemo(
    () => ({
      connect: handleConnect,
      disconnect,
      isConnected: isConnected && isMessageVerified,
      isConnecting: isPending || isSigningMessage,
      error,
      connectors,
      errorMessage,
      clearError,
    }),
    [
      handleConnect,
      disconnect,
      isConnected,
      isMessageVerified,
      isPending,
      isSigningMessage,
      error,
      connectors,
      errorMessage,
      clearError,
    ]
  );

  if (!isClient) return null;

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context)
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  return context;
}
