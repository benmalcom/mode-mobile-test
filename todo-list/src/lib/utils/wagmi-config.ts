import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

import { polygonAmoyTestnet, polygonRPCUrl } from '~/lib/web3/chains';

const projectId = '457751f94c56c29d849a484620dcb62c';

export const config = createConfig({
  chains: [mainnet, polygonAmoyTestnet],
  connectors: [injected(), walletConnect({ projectId }), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [polygonAmoyTestnet.id]: http(polygonRPCUrl),
  },
});
