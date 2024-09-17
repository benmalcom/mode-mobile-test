'use client';

import { TodoModule } from '~/lib/pages/home/todo-module';
import { WalletConnector } from '~/lib/pages/home/wallet-connector';
import { useWeb3Auth } from '~/lib/providers/web3-provider';

export const Home = () => {
  const { connect, isConnected, connectors } = useWeb3Auth();

  const handleConnect = () => {
    // Connect to the first available connector (e.g., MetaMask)
    if (connectors.length > 0) {
      connect(connectors[0]); // Assuming the first connector is MetaMask
    }
  };
  return isConnected ? (
    <TodoModule />
  ) : (
    <WalletConnector onClick={handleConnect} />
  );
};
