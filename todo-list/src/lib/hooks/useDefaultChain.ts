import { useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { switchChain } from 'wagmi/actions';

import { polygonAmoyTestnet, config } from '~/lib/utils/wagmi-config';

export function useDefaultChain() {
  const { isConnected, chain } = useAccount();

  // Memoize the chain switching function to avoid recreating it on every render
  const handleSwitchToPolygon = useCallback(async () => {
    try {
      await switchChain(config, { chainId: polygonAmoyTestnet.id });
    } catch (error) {
      console.error('Error switching chain:', error);
    }
  }, []);

  useEffect(() => {
    // Switch to the default chain if connected and not already on the desired chain
    if (isConnected && chain?.id !== polygonAmoyTestnet.id) {
      handleSwitchToPolygon();
    }
  }, [isConnected, chain, handleSwitchToPolygon]); // Add handleSwitchToPolygon to dependencies
}
