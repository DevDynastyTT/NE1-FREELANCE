Cypress.on('window:before:load', (win) => {
    // Disable the native fetch function
    delete win.fetch;
  
    // Enable cross-origin resource sharing
    win.fetch = (input, init) => {
      if (init && init.headers) {
        init.headers['Access-Control-Allow-Origin'] = '*';
        init.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
        init.headers['Access-Control-Allow-Headers'] = '*';
      }
      return win.originalFetch(input, init);
    };
  
    // Preserve the original fetch function for other functionality
    win.originalFetch = win.fetch;
  });
  
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })