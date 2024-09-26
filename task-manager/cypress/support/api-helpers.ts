// File: cypress/support/api-helpers.js
// Helper functions
export const addTask = (title: string) => {
  cy.contains('New Task').click();
  cy.get('input[placeholder="Todo title"]').type(title);
  cy.get('textarea[placeholder="A brief description"]').type(
    'Description for my new task.'
  );
  cy.contains('Submit').click();
  cy.contains('Add Todo').should('not.exist');
};

export const editTask = (oldTitle: string, newTitle: string) => {
  cy.contains(oldTitle)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Edit').click();
    });
  cy.get('input[placeholder="Todo title"]').clear().type(newTitle);
  cy.contains('button', 'Submit').click();
  cy.contains('Edit Todo').should('not.exist');
};

export const deleteTask = (title: string | number | RegExp) => {
  cy.contains(title)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Delete').click();
    });
};

export const markTaskAsCompleted = (title: string | number | RegExp) => {
  cy.contains(title)
    .parents('tr')
    .within(() => {
      cy.get('.rowDropdown').click();
      cy.contains('Mark as Completed').click();
    });
};
