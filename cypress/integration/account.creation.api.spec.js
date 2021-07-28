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
    
    it('Verify login error for invalid username/password', () => {

        cy.request({ method: 'POST', url: `${Cypress.config('baseUrl')}/login.htm?username=test&password=test123`, failOnStatusCode: false})
        .should((response) => {
            expect(response.status).equal(500)
        })
    })

    it('Verify bad request for invalid payload', () => {

        cy.request({ method: 'POST', url: (`${Cypress.config('baseUrl')}/services_proxy/bank/createAccount?customerId=${CUSTOMER_ID}&newAccountType=1`),
                    failOnStatusCode: false})
                .should((response) => {
            expect(response.status).equal(400)
            })

        cy.request({ method: 'POST', url: `${Cypress.config('baseUrl')}/services_proxy/bank/billpay?amount=200`, 
                failOnStatusCode: false })
                .then((response) => {              
                    expect(response.status).equal(400)
        })

        cy.request({ method: 'GET', url: `${Cypress.config('baseUrl')}/services_proxy/bank/accounts/transactions`, failOnStatusCode: false })
                .should((response) => {
                    expect(response.status).equal(400)

                })
    })

    it('Verify not found when endpoint/account is invalid', () => {

        cy.request({ method: 'GET', url: `${Cypress.config('baseUrl')}/services_proxy/bank/accounts`, failOnStatusCode: false })
        .should((response) => {
            expect(response.status).equal(404)
        })
    })

    it('Verify internal server error', () => {

        cy.request({ method: 'GET', url: `${Cypress.config('baseUrl')}/services_proxy/bank/accounts/1212/transactions`, failOnStatusCode: false})
        .should((response) => {
            expect(response.status).equal(500)
        })
    })

    it('Verify Bill Pay', async () => {
        let initialBalance
        let values = []
        const PAYEE_NAME = 'testpayee'

        const postBillPay = {
            address: {
                street: "21 st albans road",
                city: "London",
                state: "test",
                zipCode: "N1c4da"
            },
            name: `${PAYEE_NAME}`,
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
                    expect(response.body).property('payeeName').equal(PAYEE_NAME)                     
                    expect(response.body).property('amount').equal(200)

        })

        cy.request('GET', `${Cypress.config('baseUrl')}/services_proxy/bank/accounts/${Cypress.env('baseAccount')}/transactions`)
                .should((response) => {
                    expect(response.status).equal(200)
                }).then((value) => {
                    (value.body).forEach(element => {
                        if(element.hasOwnProperty('description')){
                            values.push(element['description'], element['amount'])
                        }                     
                    });
                    expect(values).to.contain(`Bill Payment to ${PAYEE_NAME}`)
                })                
    })
    
})
