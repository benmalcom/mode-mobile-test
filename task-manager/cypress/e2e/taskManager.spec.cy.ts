import {
  addTask,
  deleteTask,
  editTask,
  markTaskAsCompleted,
  interceptAddTodo,
  interceptUpdateTodo,
} from '../support/api-helpers';

describe('Task Manager Module', () => {
  const taskTitle = `My New Task ${Date.now()}`;
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
    before(() => {
      cy.get('#todoModule').should('be.visible');
      cy.contains('Task Manager').should('be.visible');
      cy.contains('button', 'New Task').should('be.visible');
    });
    after(() => {
      cy.switchToCypressWindow();
    });

    it('Should perform CRUD Todo operations', () => {
      // Add Task
      addTask(taskTitle);
      // Edit Task
      editTask(taskTitle, updatedTaskTitle);
      // Delete Task
      deleteTask(updatedTaskTitle);
    });
  });
});
