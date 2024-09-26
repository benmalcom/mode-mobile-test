import './commands';
import '@synthetixio/synpress/support';

import { polygonAmoyTestnet } from '../data/polygonAmoyTestnet';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('cypress-terminal-report/src/installLogsCollector')();

before(() => {
  // Disconnect wallet to ensure a clean state
  cy.disconnectMetamaskWalletFromAllDapps();
  cy.addMetamaskNetwork(polygonAmoyTestnet);
});

after(() => {
  cy.disconnectMetamaskWalletFromAllDapps();
});
