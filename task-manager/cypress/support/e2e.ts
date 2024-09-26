import './commands';
import '@synthetixio/synpress/support';
import type { Network } from 'ethers';

import { polygonAmoyTestnet } from '../data/polygonAmoyTestnet';

before(() => {
  // Disconnect wallet to ensure a clean state
  cy.disconnectMetamaskWalletFromAllDapps();

  // Check if the network is already added
  cy.getCurrentNetwork().then((currentNetwork: Network | undefined) => {
    cy.log(`currentNetwork .`, currentNetwork);

    if (
      currentNetwork?.chainId &&
      currentNetwork.chainId === BigInt(polygonAmoyTestnet.chainId)
    ) {
      // Network is already added, skip the add step
      cy.log(`Polygon Amoy Testnet is already added.`);
    } else {
      // Network is not added, proceed with adding it
      cy.addMetamaskNetwork(polygonAmoyTestnet);
    }
  });
});

after(() => {
  cy.disconnectMetamaskWalletFromAllDapps();
});
