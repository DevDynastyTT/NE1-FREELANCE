describe('Sign Up User Test', ()=> {
    
    it('Invalid Validation(blank username)', ()=> {
        cy.request({
            method: "POST",
            url: "https://ne1freelance.onrender.com/api/auth/register",
            body: {
                email: "testEmail@gmail.com",
                password: "password"
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(200))
    })

    it('Invalid Validation(blank email)', ()=> {
        cy.request({
            method: "POST",
            url: "https://ne1freelance.onrender.com/api/auth/register",
            body: {
                username: "TestUser",
                password: "password"
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(200))
    })

    it('Invalid Validation(blank password)', ()=> {
        cy.request({
            method: "POST",
            url: "https://ne1freelance.onrender.com/api/auth/register",
            body: {
                username: "TestUser",
                email: "testEmail@gmail.com",
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(200))
    })
    
    it('Registers and delete a new user and their profile', ()=> {
        cy.request({
            method: "POST",
            url: "https://ne1freelance.onrender.com/api/auth/register",
            body: {
                username: "TestUser",
                email: "testEmail@gmail.com",
                password: "password"
            },
            failOnStatusCode: true
        })
        .then(response=> expect(response.status).to.equal(200))
        .then(() => {
            cy.request({
                method: "DELETE",
                url: "https://ne1freelance.onrender.com/api/auth/register?email=testEmail@gmail.com",
                failOnStatusCode: true
            })
            .then(response=> expect(response.status).to.equal(200))
        })
    })
   
})