/// <reference types="Cypress" />

context('verify account creation api', () => {

    const USERNAME = Cypress.env('username')
    const PASSWORD = Cypress.env('password')
    const CUSTOMER_ID = 12212
    const BASE_ACCOUNT = Cypress.env('baseAccount')

    beforeEach(() => {
        cy.hitLoginEndpoint(USERNAME, PASSWORD)        
        cy.getCookie('JSESSIONID').then(value => {            
            Cypress.env('sessionId', value)
        })
    })

    it('Verify opening a saving account', () => {
        cy.request('POST', (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=${CUSTOMER_ID}&newAccountType=1&fromAccountId=${BASE_ACCOUNT}`))
                .should((response) => {
        expect(response.status).equal(200)
        expect(response.body).property('type').equal('SAVINGS')     
        expect(response.body).property('id').to.not.equal(null)
        expect(response.body).property('customerId').to.equal(CUSTOMER_ID)        
        })
    })

    it('Verify opening a checking account', () => {
        cy.request('POST', (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=${CUSTOMER_ID}&newAccountType=0&fromAccountId=${BASE_ACCOUNT}`))
                .should((response) => {
        expect(response.status).equal(200)
        expect(response.body).property('type').equal('CHECKING')
        expect(response.body).property('id').to.not.equal(null)
        expect(response.body).property('customerId').to.equal(CUSTOMER_ID)        
        })
    })

    it('Verify Bill Pay', () => {
        let newAccountId = Cypress.env('newAccountId')
        let initialBalance

        cy.request('POST', (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=${CUSTOMER_ID}&newAccountType=0&fromAccountId=${BASE_ACCOUNT}`))
                .should((response) => {
                    Cypress.env('newAccountId', response.body.id)       
        })

        cy.request('GET', (`${Cypress.config('baseUrl')}/services_proxy/bank/accounts/${Cypress.env('newAccountId')}`))
                .should((response) => {
                    expect(response.body).property('id').equal(newAccountId)
                    initialBalance = response.body.balance
                    expect(response.body).property('type').equal('CHECKING')
                })
    })
})