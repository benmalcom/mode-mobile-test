import {
  addTask,
  deleteTask,
  editTask,
  markTaskAsCompleted,
} from '../support/api-helpers';

describe('Task Manager Module', () => {
  const taskTitle = `My New Task ${Date.now()}`;
  const updatedTaskTitle = 'My Updated Task Title';
  const tasksToDelete = [updatedTaskTitle];

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
          // Button is disabled, handle this case or log it
          console.log('Mint NFT button is disabled');
          tasksToDelete.push(nftTask);
          addTask(nftTask);
          markTaskAsCompleted(nftTask, checkIfMintEnabled);
        }
      });
    };
    checkIfMintEnabled();
  });

  it('Should mint/burn tokens after the completed tasks', () => {
    const rpcUrl = 'https://rpc-amoy.polygon.technology/';
    const mintAndBurnTokens = () => {
      cy.intercept('POST', rpcUrl).as('mintOrBurnNFT');
      // Click the Mint NFT button
      cy.contains('Mint NFT').should('be.enabled').click();
      cy.contains('Minting').should('be.visible');
      // Wait for all requests to the RPC endpoint to finish
      cy.wait('@mintOrBurnNFT');
      // Assert the success toast
      cy.contains('NFT mint successful!').should('be.visible');
      // Click on the Burn NFT button
      cy.contains('Burn NFT').should('be.enabled').click();
      cy.wait('@mintOrBurnNFT'); // Wait for the burn request to finish
    };
    mintAndBurnTokens();
  });

  it('Should delete used tasks', () => {
    tasksToDelete.forEach((task) => {
      deleteTask(task);
    });
  });
});
