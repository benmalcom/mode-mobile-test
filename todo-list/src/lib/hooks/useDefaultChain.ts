import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { switchChain } from 'wagmi/actions';

import { polygonAmoyTestnet, config } from '~/lib/utils/wagmi-config';

export function useDefaultChain() {
  const { isConnected, chainId } = useAccount();

  useEffect(() => {
    const handleSwitchToPolygon = async () => {
      await switchChain(config, { chainId: polygonAmoyTestnet.id });
    };
    if (isConnected && chainId !== polygonAmoyTestnet.id) {
      handleSwitchToPolygon();
    }
  }, [isConnected, chainId]);
}
