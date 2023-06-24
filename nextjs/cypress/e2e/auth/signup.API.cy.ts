describe('Sign Up User Test', ()=> {
    
    it('Invalid Validation(blank username)', ()=> {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/auth/signup",
            body: {
                email: "testEmail@gmail.com",
                password: "password"
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(404))
    })

    it('Invalid Validation(blank email)', ()=> {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/auth/signup",
            body: {
                username: "TestUser",
                password: "password"
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(404))
    })

    it('Invalid Validation(blank password)', ()=> {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/auth/signup",
            body: {
                username: "TestUser",
                email: "testEmail@gmail.com",
            },
            failOnStatusCode: false
        })
        .then((response)=> expect(response.status).to.equal(404))
    })
    
    it('Registers and delete a new user and their profile', ()=> {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/auth/signup",
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
                url: "http://localhost:3000/api/auth/signup?email=testEmail@gmail.com",
                failOnStatusCode: true
            })
            .then(response=> expect(response.status).to.equal(200))
        })
    })
   
})