import { defineChain } from 'viem';
import { http, createConfig } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

// Define Polygon Amoy Testnet

export const polygonRPCUrl = 'https://rpc-amoy.polygon.technology';

export const polygonAmoyTestnet = defineChain({
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

const projectId = '457751f94c56c29d849a484620dcb62c';

export const config = createConfig({
  chains: [polygonAmoyTestnet],
  connectors: [metaMask()],
  transports: {
    [polygonAmoyTestnet.id]: http(polygonRPCUrl),
  },
});
