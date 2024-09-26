import {
  addTask,
  deleteTask,
  editTask,
  markTaskAsCompleted,
} from '../support/api-helpers';

describe('Todo Module', () => {
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

    it('Should perform CRUD operations', () => {
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

        addTask(newTaskTitle);
        cy.wait('@addTodo');
        markTaskAsCompleted(newTaskTitle);
        cy.wait('@markComplete');

        cy.contains('Mint NFT').then(($mintButton) => {
          // @ts-expect-error: It's present on the page
          if ($mintButton.is(':disabled')) {
            index += 1;
            addAndCompleteTask();
          } else {
            cy.contains('Mint NFT').should('be.enabled');
          }
        });
      };

      addAndCompleteTask();
    });
  });
});
