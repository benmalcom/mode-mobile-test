import {
  addTask,
  deleteTask,
  editTask,
  markTaskAsCompleted,
} from '../support/api-helpers';

describe('Task Manager Module', () => {
  const taskTitle = 'My New Task';
  const updatedTaskTitle = 'My Updated Task Title';
  const apiUrl = '/api/v1/todos';

  beforeEach(() => {
    cy.visit('/');
  });

  describe('Account Connection', () => {
    it('Should show Connect Wallet if not logged in', () => {
      cy.contains('button', 'Connect Metamask').should('be.visible');
    });

    it('Should trigger login modal and ask for metamask login', () => {
      cy.contains('button', 'Connect Metamask').click();
      cy.acceptMetamaskAccess({
        allAccounts: true,
        confirmDataSignatureRequest: true,
      }).should('be.true');
    });
  });

  describe('Todo Functionality', () => {
    beforeEach(() => {
      cy.wait(3000); // Wait for page to load
      cy.get('#todoModule').should('be.visible');
      cy.contains('Task Manager').should('be.visible');
      cy.contains('New Task').should('be.visible');
    });

    it('Should perform CRUD Todo operations', () => {
      // Add Task
      cy.intercept('POST', apiUrl).as('addTodo');
      addTask(taskTitle);
      cy.wait('@addTodo');
      cy.contains(taskTitle).should('be.visible');

      // Edit Task
      cy.intercept('PUT', `${apiUrl}/*`).as('updateTodo');
      editTask(taskTitle, updatedTaskTitle);
      cy.wait('@updateTodo');
      cy.contains(updatedTaskTitle).should('be.visible');

      // Delete Task
      cy.intercept('DELETE', `${apiUrl}/*`).as('deleteTodo');
      deleteTask(updatedTaskTitle);
      cy.wait('@deleteTodo');
      cy.contains(updatedTaskTitle).should('not.exist');
    });

    it('Should add task and mint token', () => {
      let index = 1;
      const addAndCompleteTask = () => {
        const newTaskTitle = `My New Task ${index}`;
        cy.intercept('POST', apiUrl).as('addTodo');
        cy.intercept('PUT', `${apiUrl}/*`).as('markComplete');
        cy.intercept('POST', 'https://rpc-amoy.polygon.technology/').as(
          'mintOrBurnNFT'
        ); // Intercept the mint NFT request

        addTask(newTaskTitle);
        cy.wait('@addTodo');
        markTaskAsCompleted(newTaskTitle);
        cy.wait('@markComplete');

        cy.contains('Mint NFT').then(async ($mintButton) => {
          // @ts-expect-error: It's present on the page
          if ($mintButton.is(':disabled')) {
            index += 1;
            addAndCompleteTask();
          } else {
            cy.contains('Mint NFT').should('be.enabled').click(); // Click the Mint NFT button
            cy.confirmMetamaskTransactionAndWaitForMining();
            // Verify "Minting" text is displayed
            cy.contains('Minting').should('be.visible');
            // Wait for all POST requests to the RPC endpoint to complete
            cy.wait('@mintOrBurnNFT'); // This waits for the first mint request
            // Check for any additional requests if necessary
            cy.wait(1000); // Adjust this delay as necessary, or use another way to ensure all requests are complete
            // Verify that the toast message appears
            cy.contains('NFT mint successful!').should('be.visible');
            cy.contains('Total NFTs minted: 1').should('be.visible');
            // Verify Burn NFT button is enabled after minting
            cy.contains('Burn NFT').should('be.enabled'); // Check the Burn NFT button state

            // Step 1: Capture the initial token balance text
            let initialBalance;
            cy.get('#tokenBalance')
              .invoke('text')
              .then((text) => {
                initialBalance = text;
              });
            // Burn the NFT
            cy.contains('Burn NFT').click(); // Click the Mint NFT button
            cy.confirmMetamaskTransactionAndWaitForMining();
            cy.contains('Burning').should('be.visible');
            // Wait for all POST requests to the RPC endpoint to complete
            cy.wait('@mintOrBurnNFT'); // This waits for the first burn request
            // Check for any additional requests if necessary
            cy.wait(1000);
            cy.contains('Token burn successful!').should('be.visible');
            cy.contains('Total NFTs minted: 0').should('be.visible');
            // Check that token balance has changed
            cy.get('#tokenBalance')
              .invoke('text')
              .should('not.be.equal', initialBalance);
          }
        });
      };

      addAndCompleteTask();
    });
  });
});
