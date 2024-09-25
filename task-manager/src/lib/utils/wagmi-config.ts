// Define Polygon Amoy Testnet

import { defineChain } from 'viem';
import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { metaMask } from 'wagmi/connectors'; // Import WalletConnect

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
    default: { http: [polygonRPCUrl] },
    public: { http: [polygonRPCUrl] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [polygonAmoyTestnet],
  connectors: [metaMask()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [polygonAmoyTestnet.id]: http(polygonRPCUrl),
  },
});
