describe('Login API test', ()=> {
    it("Invalid Email Login! Should return a status of 404", () => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/auth/login',
          body: {
            email: "ainvalidEmail@example.com",
            password: "12345678"
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(404);
          expect(response.body).to.deep.equal({ error: "Incorrect email"});
        });
      });

      it("Invalid Password Login! Should return a status of 404", () => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/auth/login',
          body: {
            email: "aaronhazzard2018@gmail.com",
            password: "invalidPassword"
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(404);
          expect(response.body).to.deep.equal({ error: "Incorrect password"});
        });
      });
    
    it("Valid Login! Should return a status of 200", ()=>{
        cy.request('POST', 'http://localhost:3000/api/auth/login', {
            email: "aaronhazzard2018@gmail.com", 
            password: "12345678"
        }).then((response) => expect(response.status).to.equal(200));
        
    })

    
})