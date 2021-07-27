/// <reference types="Cypress" />

context('verify account creation api', () => {

    const USERNAME = Cypress.env('username')
    const PASSWORD = Cypress.env('password')

    beforeEach(() => {
        cy.hitLoginEndpoint(USERNAME, PASSWORD)        
        cy.getCookie('JSESSIONID').then(value => {            
            Cypress.env('sessionId', value)
        })
    })

    it('Verify account', () => {
        cy.request('POST', (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=12212&newAccountType=1&fromAccountId=13344`))
                .should((response) => {
        expect(response.status).equal(200)
    })
    })
})