/// <reference types="Cypress" />
import promisify from 'cypress-promise'

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
        Cypress.env('newAccountId', response.body.id)      
        })

    })

    it('Verify opening a checking account', () => {
        cy.request('POST', (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=${CUSTOMER_ID}&newAccountType=0&fromAccountId=${BASE_ACCOUNT}`))
                .should((response) => {
        expect(response.status).equal(200)
        expect(response.body).property('type').equal('CHECKING')
        expect(response.body).property('id').to.not.equal(null)
        expect(response.body).property('customerId').to.equal(CUSTOMER_ID)
        Cypress.env('newAccountId', response.body.id)  
        })
    })

    it('Verify Bill Pay', async () => {
        let initialBalance

        const postBillPay = {
            address: {
                street: "21 st albans road",
                city: "London",
                state: "test",
                zipCode: "N1c4da"
            },
            name: "test",
            phoneNumber: "7898767778",
            accountNumber: `${Cypress.env('newAccountId')}`
        }

        cy.request('GET', (`${Cypress.config('baseUrl')}/services_proxy/bank/accounts/${Cypress.env('newAccountId')}`))
                .then((response) => {
                    initialBalance = response.body.balance
                    expect(response.status).equal(200)                    
                    expect(response.body).property('type').equal('CHECKING')
        })

        cy.request('POST', `${Cypress.config('baseUrl')}/services_proxy/bank/billpay?accountId=${Cypress.env('baseAccount')}&amount=200`, 
                postBillPay)
                .then((response) => {              
                    expect(response.status).equal(200)                                        
                    expect(response.body).property('payeeName').equal('test')                     
                    expect(response.body).property('amount').equal(200)

        })

        cy.request('GET', `${Cypress.config('baseUrl')}/services_proxy/bank/accounts/${Cypress.env('baseAccount')}/transactions`)
                .then((response) => {              
                    expect(response.status).equal(200)
        })
        
    })
})
