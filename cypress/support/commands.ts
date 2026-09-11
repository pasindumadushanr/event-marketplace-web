/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginByApi(email: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/auth/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 || response.status === 201) {
      const token = response.body.accessToken || response.body.token;
      window.localStorage.setItem('accessToken', token);
      if (response.body.user) {
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
      }
    }
  });
});
