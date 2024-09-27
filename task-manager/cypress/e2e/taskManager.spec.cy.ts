import {
  addTask,
  deleteTask,
  editTask,
  markTaskAsCompleted,
} from '../support/api-helpers';

describe('Task Manager Module', () => {
  const taskTitle = `My New Task ${Date.now()}`;
  const updatedTaskTitle = 'My Updated Task Title';
  const tasksToDelete: string[] = [];

  before(() => {
    cy.visit('/');
  });

  it('Should trigger metamask connection', () => {
    cy.contains('button', 'Connect Metamask').should('be.visible').click();
    cy.acceptMetamaskAccess({
      allAccounts: true,
      confirmDataSignatureRequest: true,
    }).should('be.true');
  });

  it('Should perform CRUD Todo operations', () => {
    cy.get('#todoModule').should('be.visible');
    cy.contains('Task Manager').should('be.visible');
    cy.contains('button', 'New Task').should('be.visible');

    // Add Task
    addTask(taskTitle);
    // Edit Task
    editTask(taskTitle, updatedTaskTitle);
    // Delete Task
    deleteTask(updatedTaskTitle);
  });

  it('Ensure we have two completed tasks for minting/burning', () => {
    const checkIfMintEnabled = () => {
      const nftTask = `NFT Tasks ${Date.now()}`;

      cy.get('button:contains("Mint NFT")').then(($button) => {
        if ($button.is(':disabled')) {
          // Button is disabled, add a task and complete it
          tasksToDelete.push(nftTask);
          addTask(nftTask);
          markTaskAsCompleted(nftTask, checkIfMintEnabled); // Recursively check
        } else {
          // Button is enabled, proceed with minting
          cy.log('Mint NFT button is enabled');
        }
      });
    };

    checkIfMintEnabled();
  });

  it('Should mint/burn tokens after the completed tasks', () => {
    const rpcUrl = 'https://rpc-amoy.polygon.technology/';
    cy.intercept('POST', rpcUrl).as('mintOrBurnNFT');

    const mintAndBurnTokens = () => {
      // Click the Mint NFT button
      cy.contains('button', 'Mint NFT').should('not.be.disabled').click();
      cy.contains('Minting').should('be.visible');
      cy.confirmMetamaskTransactionAndWaitForMining();

      // Wait for the mint request to finish
      cy.wait('@mintOrBurnNFT').its('response.statusCode').should('eq', 200);

      // Assert success toast message
      cy.contains('NFT mint successful!').should('be.visible');

      // Click the Burn NFT button
      cy.contains('button', 'Burn NFT').should('not.be.disabled').click();
      cy.contains('Burning').should('be.visible');
      cy.confirmMetamaskTransactionAndWaitForMining();

      // Wait for the burn request to finish
      cy.wait('@mintOrBurnNFT').its('response.statusCode').should('eq', 200);
    };

    mintAndBurnTokens();
  });

  it('Should delete used tasks', () => {
    if (!tasksToDelete.length) return;
    tasksToDelete.forEach((task) => deleteTask(task));
  });
});
