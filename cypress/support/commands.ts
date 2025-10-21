/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to drag and drop element
       * @example cy.dragTo('[data-cy="target"]')
       */
      dragTo(target: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, target) => {
  cy.wrap(subject).trigger('mousedown', { which: 1 });
  cy.get(target).trigger('mousemove').trigger('mouseup', { force: true });
  return cy.wrap(subject);
})

export {}