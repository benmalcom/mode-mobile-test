// File: cypress/support/api-helpers.js
// Helper functions
const apiUrl = '/api/v1/todos';

export const interceptAddTodo = () =>
  cy.intercept('POST', apiUrl).as('addTodo');
export const interceptUpdateTodo = () =>
  cy.intercept('PUT', `${apiUrl}/*`).as('updateTodo');
export const interceptDeleteTodo = () =>
  cy.intercept('DELETE', `${apiUrl}/*`).as('deleteTodo');
export const interceptGetTodos = () =>
  cy.intercept('GET', apiUrl).as('getTodos');

export const addTask = (title: string) => {
  interceptAddTodo();
  cy.contains('New Task').click();
  cy.get('input[placeholder="Todo title"]').type(title);
  cy.get('textarea[placeholder="A brief description"]').type(
    'Description for my new task.'
  );
  cy.contains('Submit').click();
  cy.wait('@addTodo');
  cy.contains('Add Todo').should('not.exist');
  cy.contains(title).should('be.visible');
};

export const editTask = (oldTitle: string, newTitle: string) => {
  interceptUpdateTodo();
  cy.contains(oldTitle)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Edit').click();
    });
  cy.get('input[placeholder="Todo title"]').clear().type(newTitle);
  cy.contains('button', 'Submit').click();
  cy.wait('@updateTodo');
  cy.contains('Edit Todo').should('not.exist');
  cy.contains(newTitle).should('be.visible');
};

export const deleteTask = (title: string | number | RegExp) => {
  interceptDeleteTodo();
  cy.contains(title)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Delete').click();
      cy.wait('@deleteTodo');
    });
  cy.contains(title).should('not.exist');
};

export const markTaskAsCompleted = (
  title: string | number | RegExp,
  callback?: () => void
) => {
  interceptUpdateTodo();
  cy.contains(title)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Mark as Completed').click();
    });

  // Wait for the update request to finish
  cy.wait('@updateTodo').then(() => callback?.());
};
