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
import { formatConnectErrors } from '~/lib/utils/error';
import { signAndVerifyMessage } from '~/lib/utils/verify-message';

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

const MESSAGE_VERIFIED_KEY = 'messageVerified';

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  useDefaultChain();
  const { state } = useConfig();
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [isMessageVerified, setIsMessageVerified] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      localStorage.getItem(MESSAGE_VERIFIED_KEY) === 'true'
    );
  });

  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const message = useMemo(
    () => `Sign this message to authenticate\n${new Date().toISOString()}`,
    []
  );

  useEffect(() => setIsClient(true), []);

  const handleMessageSignAndVerify = useCallback(async () => {
    setIsSigningMessage(true);
    if (!isConnected || !address) {
      setErrorMessage('Wallet not connected or address missing.');
      disconnect();
      return;
    }
    try {
      await signAndVerifyMessage(signMessageAsync, address, message);
      setIsMessageVerified(true);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unknown error occurred during message signing';
      setErrorMessage(errorMsg);
      disconnect();
    } finally {
      setIsSigningMessage(false);
    }
  }, [isConnected, address, signMessageAsync, message, disconnect]);

  useEffect(() => {
    if (!isConnected) {
      setIsMessageVerified(false);
    }
  }, [isConnected]);

  useEffect(() => {
    localStorage.setItem(MESSAGE_VERIFIED_KEY, String(isMessageVerified));
  }, [isMessageVerified]);

  useEffect(() => {
    if (isConnected && !isMessageVerified) {
      handleMessageSignAndVerify().catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
        disconnect();
      });
    }
  }, [isConnected, isMessageVerified, handleMessageSignAndVerify, disconnect]);

  useEffect(() => {
    if (error) {
      setErrorMessage(formatConnectErrors(error as ConnectErrorType));
    }
  }, [error]);

  const clearError = useCallback(() => setErrorMessage(null), []);

  const handleConnect = useCallback(() => {
    disconnect();
    clearError();
    if (isPending || isConnected) return;

    const metaMaskConnector = connectors.find(
      (connector) => connector.name === 'MetaMask'
    );
    if (!metaMaskConnector) {
      setErrorMessage('MetaMask not found');
      return;
    }
    connect({
      connector: metaMaskConnector,
    });
  }, [clearError, connect, connectors, disconnect, isConnected, isPending]);

  useEffect(() => {
    // The config state from wagmi holds on to connection data even after disconnect,  we need to disconnect it for total reset
    if (state.current && state.status === 'disconnected') {
      disconnect();
    }
  }, [disconnect, state]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const value = useMemo(
    () => ({
      connect: handleConnect,
      disconnect: handleDisconnect,
      isConnected: isConnected && isMessageVerified,
      isConnecting: isPending || isSigningMessage,
      error,
      connectors,
      errorMessage,
      clearError,
    }),
    [
      handleConnect,
      handleDisconnect,
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
