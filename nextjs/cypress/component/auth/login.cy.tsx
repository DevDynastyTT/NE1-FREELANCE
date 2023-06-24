import Login from "@app/auth/login/page";

describe('Login Component Test', ()=>{
    beforeEach(()=> cy.mount(<Login />))

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
})