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
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { useDefaultChain } from '~/lib/hooks/useDefaultChain';
import { formatConnectErrors } from '~/lib/utils/error';
import { signAndVerifyMessage } from '~/lib/utils/verify-message';

interface Web3AuthContextType {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | undefined;
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
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isMessageVerified, setIsMessageVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(MESSAGE_VERIFIED_KEY) === 'true';
    }
    return false;
  });

  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const message = useMemo(
    () => `Sign this message to authenticate\n${new Date().toISOString()}`,
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update handleSignMessage
  const handleMessageSignAndVerify = useCallback(async () => {
    setIsSigningMessage(true);
    if (!isConnected) throw new Error('Wallet not connected.');

    if (!address) {
      throw new Error('Address not available, skipping message signing.');
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
      // Sometimes isConnected can be false but MetaMask is still connected, disconnect again
      disconnect();
    }
  }, [isConnected, disconnect]);

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

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleConnect = useCallback(() => {
    clearError();
    if (isPending || isConnected) {
      return; // Prevent multiple connection requests
    }
    // Find the MetaMask connector by name or id
    const metaMaskConnector = connectors.find(
      (connector) => connector.name === 'MetaMask'
    );

    if (!metaMaskConnector) {
      console.error('MetaMask not found');
      return;
    }
    connect({ connector: metaMaskConnector });
  }, [clearError, connect, connectors, isConnected, isPending]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const value = useMemo(
    () => ({
      connect: handleConnect,
      disconnect: handleDisconnect,
      isConnected: isConnected && isMessageVerified,
      address,
      error,
      connectors,
      isConnecting: isPending || isSigningMessage,
      errorMessage,
      clearError,
    }),
    [
      handleConnect,
      handleDisconnect,
      isConnected,
      isMessageVerified,
      address,
      error,
      connectors,
      isPending,
      isSigningMessage,
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
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}
