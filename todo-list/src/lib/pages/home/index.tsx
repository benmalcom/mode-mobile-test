'use client';

import { TodoModule } from '~/lib/pages/home/todo-module';
import { WalletConnector } from '~/lib/pages/home/wallet-connector';
import { useWeb3Auth } from '~/lib/providers/web3-provider';

export const Home = () => {
  const { isConnected } = useWeb3Auth();

  return isConnected ? <TodoModule /> : <WalletConnector />;
};
