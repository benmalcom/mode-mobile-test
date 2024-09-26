import './commands';
import '@synthetixio/synpress/support';

import { polygonAmoyTestnet } from '../data/polygonAmoyTestnet';

before(() => {
  // Disconnect wallet to ensure a clean state
  cy.disconnectMetamaskWalletFromAllDapps();
  cy.addMetamaskNetwork(polygonAmoyTestnet);
});

after(() => {
  cy.disconnectMetamaskWalletFromAllDapps();
});
