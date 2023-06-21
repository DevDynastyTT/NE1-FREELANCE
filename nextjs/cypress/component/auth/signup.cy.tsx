import Signup from "@app/auth/signup/page";

describe('Signup Component Test', ()=>{
    beforeEach(()=> cy.mount(<Signup />))

    it('Check for blank username input', ()=> {
        cy.get('[name="email"]').type('invalidemail@gmail.com');
        cy.get('[name="password"]').type('invalidpassword');
        cy.get('[name="confirmPassword"]').type('invalidpassword1');
        cy.get('form').submit();

        cy.get('.alert').contains('Enter your username')

    })
    it('Check for blank email input', ()=> {
        cy.get('[name="username"]').type('Test User Name');
        cy.get('[name="password"]').type('invalidpassword');
        cy.get('[name="confirmPassword"]').type('invalidpassword1');
        cy.get('form').submit();

        cy.get('.alert').contains('Enter your email')

    })

    it('Check for blank password input', ()=> {
        cy.get('[name="username"]').type('Test User Name');
        cy.get('[name="email"]').type('invalidemail@gmail.com');
        cy.get('[name="confirmPassword"]').type('invalidpassword1');

        cy.get('form').submit();

        cy.get('.alert').contains('Enter your password')

    })

    it('Check for blank confirmPassword input', ()=> {
        cy.get('[name="username"]').type('Test User Name');
        cy.get('[name="email"]').type('invalidemail@gmail.com');
        cy.get('[name="password"]').type('invalidpassword');

        cy.get('form').submit();

        cy.get('.alert').contains('Please confirm your password')

    })

    it('Passwords do not match', ()=> {
        cy.get('[name="username"]').type('invalidUsername');
        cy.get('[name="email"]').type('invalidemail@gmail.com');
        cy.get('[name="password"]').type('invalidpassword');
        cy.get('[name="confirmPassword"]').type('invalidpassword1');
        cy.get('form').submit();
 
        cy.get('.alert').contains('Passwords must match')
    })

    it('Passwords match and all fields are valid', ()=> {
        cy.get('[name="username"]').type('invalidUsername');
        cy.get('[name="email"]').type('invalidemail@gmail.com');
        cy.get('[name="password"]').type('invalidpassword');
        cy.get('[name="confirmPassword"]').type('invalidpassword');
        cy.get('form').submit();
 
        cy.get('.alert').should('not.be.visible')
    })

    it('It should check to see if the email has already been taken and submit', ()=> {
        cy.get('[name="username"]').type('invalidUsername');
        cy.get('[name="email"]').type('aaronhazzard2018.com');
        cy.get('[name="password"]').type('invalidpassword');
        cy.get('[name="confirmPassword"]').type('invalidpassword');
        cy.get('form').submit();

        cy.get('.alert').contains('Email')
    })
})