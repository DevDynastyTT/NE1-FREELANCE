describe('Login Test', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/auth/login');
  });

  it('It should check if email doesnt match records', ()=> {
    cy.get('[name="email"]').type('invalidemail@gmail.com');
    cy.get('[name="password"]').type('12345678');
    cy.get('form').submit();
  })

  it('It should check if password doesnt match records', ()=> {
      cy.get('[name="email"]').type('aaronhazzard2018.com');
      cy.get('[name="password"]').type('invalidpassword');
      cy.get('form').submit();
  })

  it('It should login successfully', ()=> {
      cy.get('[name="email"]').type('aaronhazzard2018.com');
      cy.get('[name="password"]').type('12345678');
      cy.get('form').submit();
  })
});
