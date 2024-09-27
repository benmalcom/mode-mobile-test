// File: cypress/support/api-helpers.js
// Helper functions
const apiUrl = '/api/v1/todos';

export const addTask = (title: string) => {
  cy.intercept('POST', apiUrl).as('addTodo');
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
  cy.intercept('PUT', `${apiUrl}/*`).as('updateTodo');
  cy.contains(oldTitle)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Edit').click();
    });
  cy.get('input[placeholder="Todo title"]').clear().type(newTitle);
  cy.contains('button', 'Submit').click();
  cy.intercept('PUT', `${apiUrl}/*`).as('updateTodo');
  cy.contains('Edit Todo').should('not.exist');
  cy.contains(newTitle).should('be.visible');
};

export const deleteTask = (title: string | number | RegExp) => {
  cy.intercept('DELETE', `${apiUrl}/*`).as('deleteTodo');
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
  cy.intercept('PUT', `${apiUrl}/*`).as('updateTodo');
  cy.contains(title)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Mark as Completed').click();
    });

  // Wait for the update request to finish
  cy.wait('@updateTodo').then(() => callback?.());
};
