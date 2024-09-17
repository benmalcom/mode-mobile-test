import { defineChain } from 'viem';
import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = '457751f94c56c29d849a484620dcb62c';
const polygonRPCUrl = 'https://rpc-amoy.polygon.technology';

// Define Polygon Amoy Testnet
export const polygonAmoy = defineChain({
  id: 80_002,
  name: 'Polygon Amoy Testnet',
  network: 'polygon-amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: [polygonRPCUrl],
    },
    public: {
      http: [polygonRPCUrl],
    },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [mainnet, polygonAmoy],
  connectors: [injected(), walletConnect({ projectId }), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [polygonAmoy.id]: http(polygonRPCUrl),
  },
});
