// components/AuthContext.tsx
import { WalletConnectConnector } from '@walletconnect/web3-provider';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

const AuthContext = createContext<{
  address: string | null;
  isConnected: boolean;
  connectWallet: () => void;
}>({
  address: null,
  isConnected: false,
  connectWallet: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();

  const connectWallet = async () => {
    connect({
      connector: new WalletConnectConnector({
        rpc: {
          [polygonAmoyNetwork.chainId]: polygonAmoyNetwork.rpcUrls[0],
        },
      }),
    });
  };

  useEffect(() => {
    // Handle address changes or connection status changes
  }, [address, isConnected]);

  return (
    <AuthContext.Provider value={{ address, isConnected, connectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
